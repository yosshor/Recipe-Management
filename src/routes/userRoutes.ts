import authMiddleware from "../middleware/authMiddleware" ; 
import express from "express";
import { uploadProfilePicture } from "../controllers/uploadPictureController";
import getUserData from "../controllers/userData";

const router = express.Router();
router.post('/uploadProfilePicture', uploadProfilePicture);
router.get('/getUserData', getUserData);

export default router;