import * as express from "express";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";
import music_repository from "../repository/music_repository";
import { deleteObjectFromS3, imageUploader } from "../amazon_s3/imageUploader";
import multer from "multer";
import { findById, findAll, save, update, deleteById } from "../repository/crud_repository";
import music_detail_repository from "../repository/music_video_repository";

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/admin",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.session.user_id);

    if (req.session.user_id === "" || req.session.user_id === undefined) {
      res.send(
        `<script type = "text/javascript">alert("로그인 화면으로 이동합니다."); location.href = "/admin/login";</script>`
      );
    }
    const list = await music_repository.selectAllMusicList();
    const videos = await music_repository.selectMusicVideo();
    const response = await findById("music_video", "music_id", 1);
    console.log("response:", response);

    res.render("music_admin", { musics: list, videos: videos });
  }
);

router.get(
  "/admin/login",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render("login", {});
  }
);

router.post(
  "/admin/login",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id, password } = req.body;
    if (id === "equal" && password === "1234") {
      req.session.user_id = "equal";

      res.send(
        `<script type = "text/javascript">alert("환영합니다."); location.href = "/admin";</script>`
      );
    }
  }
);

router.post(
  "/move",
  upload.single("video"),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, step, th, link, move_name } = req.body;
    console.log("name", name);

    try {
      const url = "https://d26sqqgq7qsm80.cloudfront.net/";

      let music: Music[] | null = (await music_repository.selectByName(name)) ?? [];
      console.log("music: ", music);

      await save("music_video", [
        { music_id: music[0].id, step: step, th: th, link: url + link, move_name: move_name },
      ]);

      const fileBuffer: Buffer = req.file!.buffer;
      const fileName = `${req.file?.originalname}`;
      await imageUploader(fileName, fileBuffer);

      res.send(
        `<script type = "text/javascript">alert("정상적으로 등록되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("문제가 발생했습니다. 담당자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.get(
  "/video/edit/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id: number = Number(req.params.id);

    const data = (await music_detail_repository.selectMusicVideoById(id)) ?? [];

    res.render("video_edit", { videos: data, name: data[0].music_list });
  }
);

router.post(
  "/video/edit",
  upload.single("video"),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { music_id, step, th, link, id, move_name } = req.body;
    try {
      const data = (await music_detail_repository.selectMusicVideoById(id)) ?? [];

      const url = "https://d26sqqgq7qsm80.cloudfront.net/";

      await deleteObjectFromS3(data[0].link.split("/").pop());

      const fileBuffer: Buffer = req.file!.buffer;
      const fileName = `${req.file?.originalname}`;

      await imageUploader(fileName, fileBuffer);

      await update("music_video", id, [
        { music_id: music_id, step: step, th: th, link: url + fileName, move_name: move_name },
      ]);

      res.send(
        `<script type = "text/javascript">alert("수정이 완료되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("수정에 문제가 발생했습니다. 담장자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.get(
  "/video/delete/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
      const video = (await music_detail_repository.selectMusicVideoById(Number(id))) ?? [];
      console.log(video);

      await deleteObjectFromS3(video[0].link.split("/").pop());

      await deleteById("music_video", Number(id));

      res.send(
        `<script type = "text/javascript">alert("삭제가 완료되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("삭제중 문제가 발생했습니다. 담장자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.post(
  "/music",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { title, category, singer } = req.body;
    console.log(title, category, singer);

    try {
      // let data: string[] = [{name: title, category: category, singer: singer}];
      await save("music_list", [{ name: title, category: category, singer: singer }]);
      // await music_repository.insert_music(title, category, singer);
      res.send(
        `<script type = "text/javascript">alert("정상적으로 등록되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("문제가 발생했습니다. 담당자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.get(
  "/music/edit/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id: number = Number(req.params.id);
    const data = await music_detail_repository.selectMusicByMusicId(id);
    console.log(data);

    res.render("music_edit", { music: data });
  }
);

router.post(
  "/music/edit",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id, name, singer, category } = req.body;
    console.log(name, singer, category);
    try {
      await update("music_list", id, [{ name: name, singer: singer, category: category }]);

      res.send(
        `<script type = "text/javascript">alert("수정이 완료되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("수정에 문제가 발생했습니다. 담장자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.get(
  "/music/delete/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
      await deleteById("music_list", Number(id));
      res.send(
        `<script type = "text/javascript">alert("삭제가 완료되었습니다."); location.href = "/admin";</script>`
      );
    } catch (error) {
      console.error(error);
      res.send(
        `<script type = "text/javascript">alert("삭제중 문제가 발생했습니다. 담장자에게 문의해주세요. ${error}"); window.history.back();</script>`
      );
    }
  }
);

router.post(
  "/test-video",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let { link } = req.body;

    res.render("video", { link: String(link) });
  }
);

export default router;
