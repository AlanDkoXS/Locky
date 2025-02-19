import { Request, Response } from 'express';
import { PinService } from '../../domain/services/pin.service';
import { CustomError } from '../../domain/errors/custom.error';

export class PinController {
  private pinService = new PinService();

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Unexpected Error:', error);
    return res.status(500).json({ message: 'Error Internal Server' });
  };

  async createPin(req: Request, res: Response): Promise<Response> {
    const { credentialId } = req.body;

    if (!credentialId) {
      return res.status(400).json({ error: 'Credential Id is required' });
    }

    try {
      const pin = await this.pinService.createPin(credentialId);
      return res.status(201).json(pin);
    } catch (error) {
      return res.status(500).json({ error: 'PIN Error' });
    }
  }

  async validatePin(req: Request, res: Response) {
    const { pinId, code } = req.body;

    if (!pinId || !code) {
      return res.status(400).json({ message: 'pinId and code are required' });
    }

    try {
      const isValid = await this.pinService.validatePin(pinId, code);

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid PIN' });
      }

      return res.status(200).json({ message: 'PIN is valid', valid: isValid });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
