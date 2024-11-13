import express from "express";
import {
  createRecipe,
  getAllRecipes,
  likeRecipe,
  addComment,
  searchRecipes,
  searchRecipesIngredients,
  deleteRecipe,
  getRecipeData,
  updateRecipe,
  searchRecipesCategory,
} from "../controllers/recipeController";
import multer from "multer";

import authMiddleware from "../middleware/authMiddleware";
import recipeMiddleware, { recipeGetRecipeId } from "../middleware/recipeMidd";
import { uploadRecipePicture } from "../controllers/uploadRecipeController";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("image"), createRecipe);
router.put("/update-recipe", recipeMiddleware, updateRecipe);
router.post("/uploadRecipePicture", recipeGetRecipeId, uploadRecipePicture);
router.get("/get-all", recipeMiddleware, getAllRecipes);
router.get("/get-recipe-details/:Id", recipeMiddleware, getRecipeData);
router.post("/:id/like",recipeMiddleware, likeRecipe);
router.post("/:id/comment",recipeMiddleware, addComment);
router.get("/search", recipeMiddleware, searchRecipes);
router.get("/searchIngredients", recipeMiddleware, searchRecipesIngredients);
router.get("/searchCategory", recipeMiddleware, searchRecipesCategory);

router.delete("/:Id/delete", recipeMiddleware, deleteRecipe);


// module.exports = router;
export default router;
