import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const tempDir = path.join(process.cwd(), "temp");
const storeImage = path.join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    cb(null, `${uuid()}${file.originalname}`);
  },
});

const extensionWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypeWhiteList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const uploadMiddleware = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    if (
      !extensionWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export { uploadMiddleware };
