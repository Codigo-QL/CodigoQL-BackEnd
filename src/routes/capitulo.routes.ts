import { Router } from "express";
import { getAllCapitulos } from "../controllers/capitulo.controller";

const router = Router();

router.get("/", getAllCapitulos);

export default router;
