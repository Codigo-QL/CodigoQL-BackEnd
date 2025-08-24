import { Router } from "express";
import nivelRouter from "./nivel.routes";
import capituloRouter from "./capitulo.routes";
import personagemRouter from "./personagem.routes";

const router = Router();

router.use("/niveis", nivelRouter);

router.use("/capitulos", capituloRouter);

router.use("/personagens", personagemRouter);

export default router;
