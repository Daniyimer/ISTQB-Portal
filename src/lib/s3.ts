import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.MINIO_ENDPOINT || "localhost";
const port = process.env.MINIO_PORT || "9000";

// For server-side operations, we need the full URL to MinIO
const s3Endpoint = process.env.NODE_ENV === "production" 
  ? `http://${endpoint}:${port}` 
  : `http://localhost:${port}`; // Use localhost in dev when running Next.js outside docker but MinIO inside docker

export const s3Client = new S3Client({
  region: "us-east-1", // MinIO default region
  endpoint: s3Endpoint,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "password",
  },
  forcePathStyle: true, // Required for MinIO
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "estqb-files";

export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export function getPublicUrl(key: string) {
  // Assuming the bucket policy is set to public read
  return `${s3Endpoint}/${BUCKET_NAME}/${key}`;
}
