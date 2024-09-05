import express from "express";
import { createCategory, getCategories, updateCategory,deleteCategory,} from "../controllers/category.controller.js";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(authenticateUser, authorizeRoles("admin"), createCategory);

categoryRouter
  .route("/:id")
  .put(authenticateUser, authorizeRoles("admin"), updateCategory)
  .delete(authenticateUser, authorizeRoles("admin"), deleteCategory);

export default categoryRouter;
