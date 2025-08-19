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

export const getDatabaseFile = async (req: Request, res: Response) => {
  try {
    const { codigo_base } = req.params;

    const baseDados = await prisma.base_dados.findUnique({
      where: { codigo: codigo_base },
    });

    if (!baseDados || !baseDados.arquivo) {
      return res.status(404).json({ error: "Arquivo de banco de dados não encontrado." });
    }

    res.setHeader('Content-Type', 'application/x-sqlite3');
    res.setHeader('Content-Disposition', `attachment; filename="${baseDados.nome}.sqlite"`);
    
    res.send(baseDados.arquivo);

  } catch (error) {
    console.error("Erro ao buscar arquivo de banco de dados:", error);
    res.status(500).json({ error: "Erro interno ao buscar arquivo de banco de dados." });
  }
};
