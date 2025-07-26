"use server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const getImages = async () => {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));

  return response;
};

export const getImage = async (id: string) => {
  const command = new GetObjectCommand({ Bucket, Key: id });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return src;
};

export const createImage = async (
  formData: FormData,
  imagesToDelete?: (string | null | undefined)[],
) => {
  if (imagesToDelete && imagesToDelete?.length > 0) {
    const res = await Promise.all(
      imagesToDelete.map(
        (key) => key && s3.send(new DeleteObjectCommand({ Bucket, Key: key })),
      ),
    );

    console.log("deleted", res);
  }

  const files = formData.getAll("image") as File[];

  const response = await Promise.all(
    files.map(async (file) => {
      const Body = new Uint8Array(await file.arrayBuffer());
      const uniqueFileName = uuid();

      s3.send(new PutObjectCommand({ Bucket, Key: uniqueFileName, Body }));

      return uniqueFileName;
    }),
  );

  return response;
};
