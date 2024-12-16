import * as express from "express";
import * as dotenv from "dotenv";
import { Music } from "../types/types";
import music_repository from "../repository/music_repository";
import move_repository from "../repository/move_repository";
import crud_repository from "../repository/crud_repository";

dotenv.config();

const router = express.Router();

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
    console.log(videos);

    res.render("music_admin", { musics: list, videos: videos });
  }
);

router.get(
  "/admin/test",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const list = await move_repository.selectMoveJoinMusic();

    res.send(list);
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
    console.log(id, password);
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
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, step, th, link, move_name } = req.body;
    console.log(name, step, th, move_name);
    try {
      let music: Music[] | null = (await music_repository.selectByName(name)) ?? [];
      console.log(music);

      await crud_repository.save("music_video", [
        { music_id: music[0].id, step: step, th: th, link: link, move_name: move_name },
      ]);
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

    const data = (await move_repository.selectById(id)) ?? [];
    console.log(data);

    res.render("video_edit", { videos: data, name: data[0].music_list });
  }
);

router.post(
  "/video/edit",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { music_id, step, th, link, id, move_name } = req.body;
    try {
      await crud_repository.update("music_video", id, [
        { music_id: music_id, step: step, th: th, link: link, move_name: move_name },
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
      await crud_repository.deleteById("music_video", Number(id));
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

/**
 * body:
 * title: string
 * category: string
 * singer: string
 */
router.post(
  "/music",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { title, category, singer } = req.body;
    console.log(title, category, singer);

    try {
      // let data: string[] = [{name: title, category: category, singer: singer}];
      await crud_repository.save("music_list", [
        { name: title, category: category, singer: singer },
      ]);
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
  "/edit/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id: number = Number(req.params.id);
    const data = await music_repository.selectById(id);
    console.log(data);

    res.render("music_edit", { music: data });
  }
);

router.post(
  "/edit",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id, name, singer, category } = req.body;
    console.log(name, singer, category);
    try {
      // await music_repository.update_music(Number(id), name, category, singer);

      await crud_repository.update("music_list", id, [
        { name: name, singer: singer, category: category },
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
  "/delete/:id",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
      await crud_repository.deleteById("music_list", Number(id));
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
    console.log(link);

    res.render("video", { link: String(link) });
  }
);

export default router;
