import express, { Request, Response, NextFunction } from "express";
import path from "path";
import * as dotenv from "dotenv";
import indexRouter from "./routes/music_controller";
import adminRouter from "./routes/admin_controller";
const app = express();

// API 문서
const swaggerFile = require("./swagger/swagger-output.json");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // 템플릿 엔진 설정
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

app.listen(8001, () => {
  // 포트번호 설정
  console.log("8001번 포트에서 서버 대기중입니다!");
});
