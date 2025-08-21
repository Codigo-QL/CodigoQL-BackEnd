import { Router } from "express";
import { getDatabaseFile, getNivelById, validateQuery } from "../controllers/nivel.controller";

const router = Router();

router.get("/:id", getNivelById);

router.get("/database/:codigo_base", getDatabaseFile);

router.post("/validate/:id", validateQuery);

export default router;
