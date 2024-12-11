import * as express from "express";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music } from "../types/types";
import music_repository from "../repository/music_repository";

dotenv.config();
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = {
    status: 200,
    message: "안녕하세요 댄스매니저 API를 서빙해주고 있어요 ^ㅁ^",
    data: "https://swagger....",
  };

  res.status(200).json(response);
});

router.get(
  "/music",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("-------음악 전체 조회 요청 ------");

    try {
      const data = await music_repository.selectAllMusicList();
      res.status(200).json(data.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/music/:category",
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const category = req.params.category;
    console.log(category, "-------카테고리 별 음악 조회 요청 ------");

    try {
      const data = await music_repository.selectMusicListByCategory(category);
      res.status(200).json(data.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
);

export default router;
