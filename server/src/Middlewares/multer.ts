import multer from "multer";
import fs from "fs";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "./public/temp";

    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname}`;

    req.locals = req.locals || {};
    req.locals.uploadedFiles = req.locals.uploadedFiles || [];

    req.locals.uploadedFiles.push(path.join("public", "temp", name));

    cb(null, name);
  },
});

export const upload = multer({ storage });