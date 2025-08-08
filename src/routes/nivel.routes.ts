import { Router } from "express";
import { getNivelById } from "../controllers/nivel.controller";

const router = Router();

router.get("/:id", getNivelById);

export default router;
