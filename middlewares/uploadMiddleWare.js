import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const allowedExtensions = ["png", "jpg", "webp", "jpeg"];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const extension = file.originalname.toLowerCase().split(".").pop();
    if (!allowedExtensions.includes(extension)) {
      cb({ code: "INVALID_EXTENSION" });
    } else {
      cb(null, path.join(__dirname, "../", "uploads"));
    }
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.toLowerCase().split(".").pop();
    const fullname = Date.now() + "." + extension;
    cb(null, fullname);
  },
});

const uploader = multer({ storage, limits: { fileSize: 1 * 1024 * 1204 } });

export default uploader.single("file");
