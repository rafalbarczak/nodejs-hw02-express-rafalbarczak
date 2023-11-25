import { promises as fs } from "fs";
import path from "path";

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

export const setupFolder = async (path) => {
  const folderAvailable = await isAccessible(path);
  if (!folderAvailable) {
    try {
      await fs.mkdir(path);
    } catch (e) {
      console.log("no permissions");
      process.exit(1);
    }
  }
};
