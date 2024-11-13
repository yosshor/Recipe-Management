import jwt from "jsonwebtoken";
import jwt1 from "jwt-simple";

import { Request, Response, NextFunction } from "express";
import { getUserIdAndData } from "../controllers/uploadPictureController";


export function recipeMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      const { userData } = getUserIdAndData(req);
  
      if (!userData) {
        res.status(401).send({ error: "User not found" });
        return;
      }
      let parsedUserData;
      try {
        parsedUserData = JSON.parse(JSON.stringify(userData));
      } catch (error) {
        res.status(400).send({ error: "Invalid user data" });
        return;
      }
      const { userId, email, name, role } = parsedUserData;
      if (!userId) {
        res.status(401).send({ error: "User not found" });
        return;
      }
      next();
    } catch (error) {
      console.error(error);
    }
  }


  export function recipeGetRecipeId(req: any, res: Response, next: NextFunction) {
    const recipeId = req.query.recipeId;
    if (!recipeId) {
      res.status(400).send({ error: "Recipe not found" });
      return;
    }
    req.recipeId = recipeId;
    console.log(req.recipeId);
    next();
  }



export default recipeMiddleware;
