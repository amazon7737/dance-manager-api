import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";
import { Interface } from "readline";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

/* Interface Type 작성에 문제가 있어서 주석처리 */

// const findById = async (table: string, id: number, Type: Interface) => {
//   const data = await pool.from(table).select().eq("id", id).returns<Type[]>();
//   console.log(table + " 조회 요청");
//   return data.data;
// };

const save = async (table: string, parameters: any[]) => {
  try {
    const response = await pool.from(table).insert(parameters);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};

const update = async (table: string, id: number, parameters: any[]) => {
  try {
    const response = await pool.from(table).update(parameters).eq("id", id);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};

const deleteById = async (table: string, id: number) => {
  try {
    const response = await pool.from(table).delete().eq("id", id);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};

export default { save, deleteById, update };
