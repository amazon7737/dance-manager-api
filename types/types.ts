export interface Music {
  id: number;
  name: string;
  category: string;
  singer: string;
  icon: string;
}

export interface Video {
  id: number;
  link: string;
  created_at: string;
}

export interface Step {
  id: number;
  link: string;
  created_at: string;
  step: number;
  th: number;
  move_name: string;
  music_id: number;
  name: string;
}

declare module "express-session" {
  interface SessionData {
    user_id?: string; // 여기에 session에 저장할 값을 정의
    [key: string]: any; // 다른 값도 허용하려면 추가
  }
}
