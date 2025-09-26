import { Router } from "express";
import { getDatabaseFile, getNivelById, validateQuery } from "../controllers/nivel.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id", getNivelById);

router.get("/database/:codigo_base", getDatabaseFile);

router.post("/validate/:id", optionalAuth ,validateQuery);

export default router;
