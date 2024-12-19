import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();
const accessKey = process.env.S3_ACCESS_KEY || "";
const secretKey = process.env.S3_SECRET_KEY || "";
const bucketName = process.env.BUCKET_NAME || "";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

/**
 * AWS S3 이미지 업로더
 * @param {string} key - 이미지 이름
 * @param {buffer} body - multer에서 받은 image buffer
 * @returns {string} - S3에 업로드된 이미지의 URL
 */
export const imageUploader = async (key: string, body: Buffer): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: "dancemanager-video",
    Key: key,
    Body: body,
    ACL: "public-read", // 파일을 공개로 설정
    ContentType: "video/mp4", // Content-Type 지정 (예: 비디오 파일)
  });

  try {
    await s3Client.send(command);
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export const deleteObjectFromS3 = async (objectKey: string): Promise<void> => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const response = await s3Client.send(deleteCommand);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
