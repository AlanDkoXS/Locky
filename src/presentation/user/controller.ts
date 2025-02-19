import { Request, Response } from 'express';
import { UserService } from '../../domain/services/user.service';
import { CustomError } from '../../domain/errors/custom.error';
import { LoginUserDTO } from '../../domain/dtos/login.dto';

export class UserController {
  constructor(private readonly userService: UserService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: 'Error Internal Server' });
  };

  createUser = async (req: Request, res: Response) => {
    this.userService
      .create(req.body)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res));
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const result = LoginUserDTO.login(req.body);

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      const data = await this.userService.login(
        result.data!.email,
        result.data!.password
      );
      return res.status(200).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  };
}
