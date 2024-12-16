import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

const selectAllMusicList = async () => {
  const data = await pool.from("music_list").select().returns<Music[]>();
  console.log("-------음악 전체 조회 요청 ------", data);
  return data;
};

const selectMusicListByCategory = async (category: string) => {
  const data = await pool.from("music_list").select().eq("category", category).returns<Music[]>();
  console.log(category, "-------카테고리 별 음악 조회 요청 ------", data);
  return data;
};

const selectMusicVideo = async () => {
  try {
    const data = await pool.from("music_video").select().returns<Video[]>();
    console.log(data.data);
    return data.data;
  } catch (error) {
    throw new Error();
  }
};

export default {
  selectAllMusicList,
  selectMusicListByCategory,
  selectMusicVideo,
};
