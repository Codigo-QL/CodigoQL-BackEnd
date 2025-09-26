import { Router } from "express";
import { getAllCapitulos } from "../controllers/capitulo.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", optionalAuth ,getAllCapitulos);

export default router;
