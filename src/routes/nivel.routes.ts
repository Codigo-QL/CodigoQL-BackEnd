import { Router } from "express";
import { getAllNiveis } from "../controllers/nivel.controller";

const router = Router();

router.get("/", getAllNiveis);

export default router;
