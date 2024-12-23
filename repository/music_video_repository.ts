import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

// music_id 를 기준으로 재정렬하여 music_list의 name을 가지고 select
// selectMoveJoinMusic
const selectMusicVideoWithMusicIdOrderByDesc = async () => {
  try {
    const response = await pool
      .from("music_video")
      .select(`id, link, music_list (name)`)
      .order("music_id", { ascending: false });

    return response.data;
  } catch (error) {
    throw new Error();
  }
};

// music_list 의 name을 가지고 오는 music_video에 고유 id 값을 select
// selectById
const selectMusicVideoById = async (id: number) => {
  const data = await pool
    .from("music_video")
    .select(`id, link, music_id, move_name, step, th, music_list (name)`)
    .eq("id", id);

  console.log(data);

  return data.data;
};

// selectMusicByMusicId
const selectMusicByMusicId = async (id: number) => {
  try {
    const data = await pool.from("music_video").select().eq("music_id", id);
    return data.data;
  } catch (error) {
    throw new Error();
  }
};

// selectByMusicId
const selectByMusicId = async (id: number) => {
  const data = await pool
    .from("music_video")
    .select(`id, link, music_id, move_name, step, th, music_list (name)`)
    .eq("music_id", id);

  console.log(data);

  return data.data;
};

// music_id, step, th 를 가지고 music_video select
// selectByStepAndTh
const selectByStepAndTh = async (music_id: number, step: number, th: number) => {
  const data = await pool
    .from("music_video")
    .select(`*`)
    .eq("music_id", music_id)
    .eq("step", step)
    .eq("th", th);

  console.log("data:", data);

  return data.data;
};

export default {
  selectMusicVideoWithMusicIdOrderByDesc,
  selectMusicVideoById,
  selectByStepAndTh,
  selectByMusicId,
  selectMusicByMusicId,
};
