import Jimp from "jimp";
import path from "path";
import { v4 as uuid } from "uuid";
import { promises as fs } from "fs";
import User from "../../models/User.js";

const storeImageDir = path.join(process.cwd(), "public/avatars");

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File isn't a photo" });
  }

  const { path: temporaryPath } = req.file;
  const extension = path.extname(temporaryPath);
  const fileName = `${uuid()}${extension}`;
  const filePath = path.join(storeImageDir, fileName);

  try {
    await fs.rename(temporaryPath, filePath);
  } catch (e) {
    console.log(e);
    await fs.unlink(temporaryPath);
    return next(e);
  }

  const AVATAR_WIDTH = 250;
  const AVATAR_HEIGHT = 250;

  const isImageAndTransform = async (path) => {
    return new Promise(async (resolve) => {
      Jimp.read(path, async (err, image) => {
        if (err) resolve(false);
        try {
          const w = image.getWidth();
          const h = image.getHeight();

          const cropWidth = w > AVATAR_WIDTH ? AVATAR_WIDTH : w;
          const cropHeight = h > AVATAR_HEIGHT ? AVATAR_HEIGHT : h;

          const centerX = Math.round(w / 2 - cropWidth / 2);
          const centerY = Math.round(h / 2 - cropHeight / 2);
          await image
            .rotate(360)
            .crop(
              centerX < 0 ? 0 : centerX,
              centerY < 0 ? 0 : centerY,
              cropWidth,
              cropHeight
            );
          resolve(true);
        } catch (e) {
          console.log(e);
          resolve(false);
        }
      });
    });
  };

  const isValidAndTransform = await isImageAndTransform(filePath);
  if (!isValidAndTransform) {
    await fs.unlink(filePath);
    return res
      .status(400)
      .json({ message: "File isn't a photo but is pretending to be" });
  }

  try {
    const currentUser = res.locals.user;
    const user = await User.findById(currentUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.avatarURL = `/avatars/${fileName}`;

    await user.save();

    res.status(200).json({
      message: "Avatar changed successfully",
      avatarURL: `/avatars/${fileName}`,
    });
  } catch (e) {
    next(e);
  }
};
