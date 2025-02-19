import express, { Router } from 'express';
import { SecurityBoxController } from './controller';
import { SecurityService } from '../../domain/services/security.service';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

export class SecurityBoxRoutes {
  static get routes(): Router {
    const router = express.Router();

    const securityService = new SecurityService();
    const securityBoxController = new SecurityBoxController(securityService);

    router.post('/-boxes', securityBoxController.createSecurityBox);
    router.get('/boxes', securityBoxController.getSecurityBoxes);
    router.put('/boxes/:id', securityBoxController.updateSecurityBox);
    router.delete('/-boxes/:id', securityBoxController.deleteSecurityBox);

    return router;
  }
}
