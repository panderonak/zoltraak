import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@zoltraak/env/server";

type PresignedUrlParams = {
  bucket: string;
  key: string;
};

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const createPresignedUrlWithClient = ({
  bucket,
  key,
}: PresignedUrlParams) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: 3600,
  });
};
