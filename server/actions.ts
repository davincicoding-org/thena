"use server";

import { put } from "@vercel/blob";

export async function uploadImage(
  collection: string,
  name: string,
  file: File,
) {
  const userId = "dev";
  const { url } = await put(`${collection}/${userId}/${name}`, file, {
    access: "public",
  });

  return url;
}
