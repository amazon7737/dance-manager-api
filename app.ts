import express, { Request, Response, NextFunction } from "express";
import path from "path";
import * as dotenv from "dotenv";
import apiRouter from "./routes/api_controller";
import adminRouter from "./routes/admin_controller";

var session = require("express-session");

const app = express();

// API 문서
const swaggerFile = require("./swagger/swagger-output.json");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // 템플릿 엔진 설정

app.use(
  session({
    secret: "45678()(*&*&",
    resave: false,
    saveUninitialized: true,
    cookie: { user_id: "" },
  })
);

app.use(express.json()); // JSON 본문 파싱을 활성화
app.use(express.urlencoded({ extended: true })); // 22
app.use("/api/v1", apiRouter);
app.use("/", adminRouter);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

app.listen(8001, () => {
  // 포트번호 설정
  console.log("8001번 포트에서 서버 대기중입니다!");
});
