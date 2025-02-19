import { Request, Response } from 'express';

import { CredentialStorageService } from '../../domain/services/credential.storage';
import { CustomError } from '../../domain/errors/custom.error';
import { generateSecurePassword } from '../../config/password.utils';

export class CredentialStorageController {
  private readonly credentialStorageService: CredentialStorageService =
    new CredentialStorageService();

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Unexpected Error:', error);
    return res.status(500).json({ message: 'Error Internal Server' });
  };
  constructor() {
    this.credentialStorageService = new CredentialStorageService();
  }

  createCredential = async (req: Request, res: Response) => {
    const { account, password, securityBoxId, description, code1, code2 } =
      req.body;
    this.credentialStorageService
      .createCredential(
        account,
        password,
        securityBoxId,
        description,
        code1,
        code2
      )
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getCredentials = async (req: Request, res: Response) => {
    try {
      const { securityBoxId } = req.query;

      console.log('Security box received:', securityBoxId);

      if (!securityBoxId || typeof securityBoxId !== 'string') {
        return res.status(400).json({ message: 'Invalid Security Box Id' });
      }

      this.credentialStorageService
        .getCredentials(securityBoxId)
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    } catch (error) {
      console.error('Error creating credential', error);
      res.status(500).json({ message: 'Error retrieving credentials' });
    }
  };
  updateCredential = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { account, password, description, code1, code2, pinCode } = req.body;
    this.credentialStorageService
      .updateCredential(
        id,
        account,
        password,
        description,
        code1,
        code2,
        pinCode
      )
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteCredential = async (req: Request, res: Response) => {
    const { id } = req.params;
    this.credentialStorageService
      .deleteCredential(id)
      .then(() => res.status(204).send())
      .catch((error) => this.handleError(error, res));
  };

  generatePassword = async (req: Request, res: Response) => {
    const password = generateSecurePassword();
    return res.status(200).json({ password });
  };
}
