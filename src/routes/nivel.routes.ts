import { Router } from "express";
import { getDatabaseFile, getNivelById } from "../controllers/nivel.controller";

const router = Router();

router.get("/:id", getNivelById);

router.get("/database/:codigo_base", getDatabaseFile);

export default router;
