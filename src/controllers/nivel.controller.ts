import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNivelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const nivel = await prisma.nivel.findUnique({
      where: { id: Number(id) },
      include: {
        capitulo: {
          select: {
            codigo: true,
            titulo: true,
          },
        },
        personagem: {
          select: {
            nome: true,
            imagem: true,
          },
        },
      },
    });

    if (!nivel) {
      return res.status(404).json({ error: "Nível não encontrado." });
    }

    res.json(nivel);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar nível." });
  }
};
