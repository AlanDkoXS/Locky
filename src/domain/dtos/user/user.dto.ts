import { regularExp } from '../../../config/regular.exp';
import { Pin } from '../../../data/postgres/models/pin.model';

regularExp;

export class CreateUserDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public lastname: string,
    public phone: string,
    public id: string,
    public pin: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateUserDTO?] {
    const { name, email, password, lastName, phone, id, pin } = object;

    if (!name) return ['Name is required'];
    if (!email) return ['Email is required'];
    if (!regularExp.email.test(email)) return ['Invalid Email'];
    if (!password) return ['Missing password'];
    if (!regularExp.password.test(password))
      return [
        'The password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, and one special',
      ];
    if (!id) return ['id is required'];
    if (!pin) return ['Pin is required'];
    if (!lastName) return ['Name is required'];
    if (!phone) return ['Name is required'];
    return [
      undefined,
      new CreateUserDTO(name, email, password, lastName, phone, id, pin),
    ];
  }
}
