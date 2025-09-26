import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { firebaseAdmin } from '../services/firebase';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    const { sessionId } = req.body;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Token de autorização não informado ou mal formatado.' });
    }

    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    const { uid, email } = decodedToken;

    if (!email) {
        return res.status(400).send({ message: 'Email não encontrado no token.' });
    }

    const aluno = await prisma.aluno.upsert({
      where: { id: uid },
      update: { email },
      create: {
        id: uid,
        email
      },
    });

    if (sessionId) {
      await prisma.submissao.updateMany({
        where: {
          sessao_id: sessionId,
          alunoId: null,
        },
        data: {
          alunoId: aluno.id,
        },
      });
    }

    res.status(200).send({ message: 'Login realizado com sucesso' });

  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(401).send({ message: 'Token inválido ou expirado.' });
  }
};
