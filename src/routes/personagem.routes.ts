import { Router } from "express";
import { getPersonagemImage } from "../controllers/personagem.controller";

const router = Router();

router.get("/:nome/imagem", getPersonagemImage);

export default router;
