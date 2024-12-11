import * as express from "express";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music } from "../types/types";
import music_repository from "../repository/music_repository";

dotenv.config();

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const data = await music_repository.selectAllMusicList();
  res.render("music_admin", { musics: data.data });
});

export default router;
