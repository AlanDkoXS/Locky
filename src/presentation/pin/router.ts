import express, { Router } from 'express';
import { PinController } from './controller';
import { PinService } from '../../domain/services/pin.service';

export class PinBoxRouter {
  static get routes(): Router {
    const router = Router();
    const pinService = new PinService();
    const pinController = new PinController();

    router.post('/create', pinController.createPin.bind(pinController));
    router.post('/validate', pinController.validatePin.bind(pinController));

    return router;
  }
}
