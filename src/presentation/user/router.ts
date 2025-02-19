import express, { Router } from 'express';
import { UserController } from './controller';
import { UserService } from '../../domain/services/user.service';

export class UsersRoutes {
  static get routes(): Router {
    const router = express.Router();

    const userService = new UserService();
    const userController = new UserController(userService);

    router.post('/register', userController.createUser);
    router.post('/login', userController.loginUser);

    return router;
  }
}
