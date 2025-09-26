import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCapitulos = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const capitulos = await prisma.capitulo.findMany({
        select: {
          codigo: true,
          titulo: true,
          descricao: true,
          nivel: {
            select: {
              id: true,
              personagem: {
                select: {
                  nome: true,
                },
              },
            },
            orderBy: {
              id: 'asc'
            }
          },
        },
        orderBy: {
          codigo: 'asc'
        }
      });
      return res.json(capitulos);
    }

    const alunoId = req.user.uid;
    const capitulos = await prisma.capitulo.findMany({
      select: {
        codigo: true,
        titulo: true,
        descricao: true,
        nivel: {
          select: {
            id: true,
            personagem: {
              select: {
                nome: true,
              },
            },
            _count: {
              select: {
                submissao: {
                  where: {
                    alunoId,
                    acertou: true
                  }
                }
              },
            }
          },
          orderBy: {
            id: 'asc'
          }
        },
      },
      orderBy: {
        codigo: 'asc'
      }
    });

    res.json(capitulos);
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os capítulos." });
  }
};
