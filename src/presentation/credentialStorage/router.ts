import express, { Router } from 'express';
import { CredentialStorageController } from './controller';

import { CredentialStorageService } from '../../domain/services/credential.storage';

export class CredentialStorageRoutes {
  static get routes(): Router {
    const router = express.Router();

    const credentialStorageService = new CredentialStorageService();
    const credentialStorageController = new CredentialStorageController();

    router.post('/create', credentialStorageController.createCredential);
    router.get('/get', credentialStorageController.getCredentials);
    router.put('/:id', credentialStorageController.updateCredential);
    router.delete('/:id', credentialStorageController.deleteCredential);

    return router;
  }
}
