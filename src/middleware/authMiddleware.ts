import jwt from "jsonwebtoken";
import jwt1 from "jwt-simple";

import { Request, Response, NextFunction } from "express";
import { getUserIdAndData } from "../controllers/uploadPictureController";

function authMiddleware(req: any, res: Response, next: NextFunction): void {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("access denied");
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const verified = jwt.verify(token, "your_jwt_secret");
    req.user = verified;
    const { userRecipe } = req.cookies;
    const secret = process.env.SECRET!;
    const { userId, email } = jwt1.decode(userRecipe, secret);
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
}


export default authMiddleware;
