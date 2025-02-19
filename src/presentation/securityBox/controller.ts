import { Request, Response } from 'express';
import { SecurityService } from '../../domain/services/security.service';
import { CustomError } from '../../domain/errors/custom.error';
import { User } from '../../data/postgres/models/user.model';
import { SecurityBox } from '../../data/postgres/models/securityBox.model';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export class SecurityBoxController {
  constructor(private readonly securityService: SecurityService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: 'Error Internal Server' });
  };

  createSecurityBox = async (req: Request, res: Response) => {
    try {
      const securityBox = new SecurityBox();
      securityBox.name = 'Personal Keys';
      securityBox.icon = 'key';
      securityBox.status = 'active';

      await securityBox.save();

      return res.status(201).json(securityBox);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getSecurityBoxes = async (req: Request, res: Response) => {
    try {
      const data = await this.securityService.getSecurityBoxes();
      return res.status(200).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateSecurityBox = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, credentials, favorite, status, icon } = req.body;

    const updatedData = {
      name,
      credentials,
      favorite: favorite !== undefined ? favorite : false,
      status: status !== undefined ? status : 'active',
      icon: icon || 'default-icon',
    };

    try {
      const updatedBox = await this.securityService.updateSecurityBox(
        id,
        updatedData
      );
      if (updatedBox) {
        return res
          .status(200)
          .json({ message: 'Box updated successfully', data: updatedBox });
      } else {
        return res.status(404).json({ message: 'Box not found' });
      }
    } catch (error: unknown) {
      console.error('Error updating box:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: 'Error updating box',
          error: error.message,
        });
      } else {
        return res.status(500).json({
          message: 'An unknown error occurred',
          error: 'Unknown error',
        });
      }
    }
  };

  deleteSecurityBox = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.securityService.deleteSecurityBox(id);
      return res.status(204).send();
    } catch (error) {
      return this.handleError(error, res);
    }
  };
}
