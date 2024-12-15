import express from "express";
import cors from "cors";

import { userController } from "./controllers/userController.js";
import { recipeController } from "./controllers/recipeController.js";
import { logRequest } from "./util/logger.js";

export const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(logRequest);

router.use("/user", userController);
router.use("/recipe", recipeController);

router.use((req, res) => {
  res.status(404);
  res.json({ message: "Route existiert nicht" });
});

export { router as apiRouter };
