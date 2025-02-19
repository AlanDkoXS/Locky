import { encriptAdapter } from '../../config/bcypt.adapter';
import { JwtAdapter } from '../../config/jwt.adapter';
import { User } from '../../data/postgres/models/user.model';

import { CreateUserDTO } from '../dtos/user/user.dto';

import { CustomError } from '../errors/custom.error';

export class UserService {
  async create(data: CreateUserDTO) {
    if (!this.validatePassword(data.password)) {
      throw CustomError.badRequest(
        'The password must have at least 12 characters, one lowercase, one uppercase, one number and one special character.'
      );
    }

    const user = new User();

    user.name = data.name;
    user.email = data.email;
    user.phone = data.phone;
    user.lastname = data.lastname;

    user.password = await encriptAdapter.hash(data.password);

    try {
      return await user.save();
    } catch (error) {
      console.log('ERRORRR', error);
      CustomError.internalServer('Error creating user');
    }
  }

  async login(email: string, password: string) {
    console.log('Login:', email, password);

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw CustomError.unAuthorized('Invalid Credentials');
    }

    console.log('User found:', user);

    const isMatching = await encriptAdapter.compare(password, user.password);

    if (!isMatching) {
      throw CustomError.unAuthorized('Invalid Credentials');
    }

    const token = await JwtAdapter.generateToken({ id: user.id });

    if (!token) {
      throw CustomError.internalServer('Error generating token');
    }

    return {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email,
        status: true,
      },
    });
    if (!user) {
      throw CustomError.notFoud('User not found');
    }
    return user;
  }

  private validatePassword(password: string): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return regex.test(password);
  }
  async findOne(id: string) {
    const user = await User.findOne({
      where: {
        status: true,
        id: id,
      },
    });
    if (!user) {
      throw CustomError.notFoud('User not found');
    }

    return user;
  }
}
