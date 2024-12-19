import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

const selectAllMusicList = async () => {
  const data = await pool.from("music_list").select().returns<Music[]>();
  return data.data;
};

// selectById
const selectMusicById = async (id: number) => {
  const data = await pool.from("music_list").select().eq("id", id).returns<Music[]>();
  return data.data;
};

const selectByName = async (name: string) => {
  const data = await pool.from("music_list").select().eq("name", name).returns<Music[]>();
  console.log(data);

  return data.data;
};

const selectMusicListByCategory = async (category: string) => {
  const data = await pool.from("music_list").select().eq("category", category).returns<Music[]>();
  return data;
};

const selectMusicVideo = async () => {
  try {
    const data = await pool
      .from("music_video")
      .select()
      .returns<Video[]>()
      .order("music_id", { ascending: true });
    return data.data;
  } catch (error) {
    throw new Error();
  }
};

// selectMusicById
const selectMusicByMusicId = async (id: number) => {
  try {
    const data = await pool.from("music_video").select().eq("music_id", id);
    return data.data;
  } catch (error) {
    throw new Error();
  }
};

export default {
  selectAllMusicList,
  selectMusicListByCategory,
  selectMusicVideo,
  selectByName,
  selectMusicById,
  selectMusicByMusicId,
};
