import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Music, Video } from "../types/types";
import { Interface } from "readline";

dotenv.config();
const supabase_url = process.env.SUPABASE_URL || "";
const supabase_key = process.env.SUPABASE_KEY || "";
const pool = createClient(supabase_url, supabase_key);

export const findAll = async (table: string) => {
  try {
    const response = await pool.from(table).select();

    console.log(response.error);
    return response;
  } catch (error) {
    throw new Error();
  }
};

export const findById = async (table: string, condition: string, id: number) => {
  try {
    const response = await pool.from(table).select().eq(condition, id);

    console.log(response.error);
    return response.data;
  } catch (error) {
    throw new Error();
  }
};

export const save = async (table: string, parameters: any[]) => {
  try {
    const response = await pool.from(table).insert(parameters);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};

export const update = async (table: string, id: number, parameters: any[]) => {
  try {
    const response = await pool.from(table).update(parameters).eq("id", id);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};

export const deleteById = async (table: string, id: number) => {
  try {
    const response = await pool.from(table).delete().eq("id", id);

    console.log(response.error);
  } catch (error) {
    throw new Error();
  }
};
