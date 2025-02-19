import { Router } from 'express';
import { UsersRoutes } from './user/router';
import { SecurityBoxRoutes } from './securityBox/router';
import { PinBoxRouter } from './pin/router';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CredentialStorageRoutes } from './credentialStorage/router';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/v1/user', UsersRoutes.routes);
    router.use(
      '/api/v1/security',
      AuthMiddleware.protect,
      SecurityBoxRoutes.routes
    );
    router.use('/api/v1/pin', AuthMiddleware.protect, PinBoxRouter.routes);
    router.use(
      '/api/v1/credential',
      AuthMiddleware.protect,
      CredentialStorageRoutes.routes
    );

    return router;
  }
}
