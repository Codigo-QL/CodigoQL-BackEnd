import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const getNivelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentId = Number(id);

    const nivel = await prisma.nivel.findUnique({
      where: { id: currentId },
      include: {
        capitulo: {
          select: {
            codigo: true,
            titulo: true,
          },
        },
        personagem: {
          select: {
            nome: true
          },
        },
      },
    });

    if (!nivel) {
      return res.status(404).json({ error: "Nível não encontrado." });
    }

    const nextNivel = await prisma.nivel.findFirst({
      where: {
        id: currentId + 1,
        codigo_cap: nivel.codigo_cap,
      },
      select: { id: true },
    });

    const responseData = {
      ...nivel,
      hasNextLevel: !!nextNivel,
    };

    res.json(responseData);
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

    const buffer = Buffer.from(baseDados.arquivo);
    const base64Data = buffer.toString('base64');

    res.json({ data: base64Data });

  } catch (error) {
    console.error("Erro ao buscar arquivo de banco de dados:", error);
    res.status(500).json({ error: "Erro interno ao buscar arquivo de banco de dados." });
  }
};

const executeQuery = (db: sqlite3.Database, sql: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const compareResultsIgnoringColumnOrder = (resultA: any[], resultB: any[]): boolean => {
  if (!resultA || !resultB || resultA.length !== resultB.length) {
    return false;
  }

  if (resultA.length === 0) {
    return true;
  }

  const sortedValuesA = resultA.map(row => Object.values(row).map(String).sort());
  const sortedValuesB = resultB.map(row => Object.values(row).map(String).sort());

  for (let i = 0; i < sortedValuesA.length; i++) {
    if (JSON.stringify(sortedValuesA[i]) !== JSON.stringify(sortedValuesB[i])) {
      return false;
    }
  }

  return true;
};

export const validateQuery = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userQuery, sessao_id, matricula } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "A query do usuário é obrigatória." });
  }

  const tempFilePath = path.join('/tmp', `db-${Date.now()}.sqlite`);
  
  try {
    const nivel = await prisma.nivel.findUnique({
      where: { id: Number(id) },
      include: {
        base_dados: true,
      },
    });

    if (!nivel || !nivel.solucao || !nivel.base_dados?.arquivo) {
      return res.status(404).json({ error: "Nível, solução ou arquivo de dados não encontrado." });
    }

    fs.writeFileSync(tempFilePath, nivel.base_dados.arquivo);
    const db = new sqlite3.Database(tempFilePath);

    let userResult, solutionResult;

    try {
      userResult = await executeQuery(db, userQuery);
      solutionResult = await executeQuery(db, nivel.solucao);
    } catch (err: any) {
      db.close();
      return res.json({
        correct: false,
        feedback: nivel.feedback_errado || "Sua query contém um erro de sintaxe. Verifique e tente novamente.",
      });
    }
    
    db.close();

    const isCorrect = compareResultsIgnoringColumnOrder(userResult, solutionResult);

    await prisma.submissao.create({
        data: {
            sessao_id: sessao_id,
            matricula: matricula === 'anonimo' ? null : matricula,
            nivel_id: Number(id),
            resposta: userQuery,
            acertou: isCorrect
        }
    });

    if (isCorrect) {
      res.json({ correct: true, feedback: nivel.feedback_correto });
    } else {
      res.json({ correct: false, feedback: nivel.feedback_errado });
    }

  } catch (error) {
    console.error("Erro no processo de validação:", error);
    res.status(500).json({ error: "Ocorreu um erro interno ao validar a resposta." });
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
