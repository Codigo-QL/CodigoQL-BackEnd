import { Router } from "express";
import nivelRouter from "./nivel.routes";

const router = Router();

router.use("/niveis", nivelRouter);

export default router;
