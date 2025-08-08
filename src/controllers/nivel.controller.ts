import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllNiveis = async (req: Request, res: Response) => {
  try {
    const niveis = await prisma.nivel.findMany();
    res.json(niveis);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar níveis." });
  }
};
