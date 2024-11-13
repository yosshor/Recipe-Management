import express from "express";
import multer from "multer";
import { login, register } from "../controllers/autoController";
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);

export default router;