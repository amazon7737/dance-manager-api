import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";
import { Interface } from "readline";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

const selectMoveJoinMusic = async () => {
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

const selectById = async (id: number) => {
  const data = await pool
    .from("music_video")
    .select(`id, link, music_id, move_name, step, th, music_list (name)`)
    .eq("id", id);
  return data.data;
};

export default { selectMoveJoinMusic, selectById };
