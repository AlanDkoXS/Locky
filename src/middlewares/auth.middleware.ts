import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../config/jwt.adapter';
import { User } from '../data/postgres/models/user.model';

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');

    if (!authorization) {
      return res
        .status(401)
        .json({ message: 'You need provide a token' });
    }

    if (!authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Invalid token, try again' });
    }

    const token = authorization.split(' ')[1];

    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };

      if (!payload || !payload.id) {
        return res
          .status(401)
          .json({ message: 'Invalid token, try again' });
      }

      const user = await User.findOne({
        where: { id: payload.id, status: true },
      });

      next();
    } catch (error) {
      console.error('Error in AuthMiddleware:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
