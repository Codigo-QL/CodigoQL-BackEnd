import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPersonagemImage = async (req: Request, res: Response) => {
  try {
    const { nome } = req.params;

    const personagem = await prisma.personagem.findUnique({
      where: { nome },
      select: { imagem: true },
    });

    if (!personagem || !personagem.imagem) {
      return res.status(404).json({ error: "Imagem do personagem não encontrada." });
    }

    res.setHeader('Content-Type', 'image/webp');
    res.send(personagem.imagem);

  } catch (error) {
    console.error("Erro ao buscar imagem do personagem:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar a imagem." });
  }
};
