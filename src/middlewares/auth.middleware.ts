import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../services/firebase';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        uid: string;
      };
    }
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next();
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.warn("Token de autenticação inválido ou expirado recebido.");
    next();
  }
};