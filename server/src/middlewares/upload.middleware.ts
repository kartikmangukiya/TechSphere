import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
