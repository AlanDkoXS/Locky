import { regularExp } from '../../config/regular.exp';

export class LoginUserDTO {
  constructor(public email: string, public password: string) {}

  static login(object: { [key: string]: any }): {
    error?: string;
    data?: LoginUserDTO;
  } {
    const { email, password } = object;

    if (!email) return { error: 'Email is required' };
    if (!regularExp.email.test(email)) return { error: 'Invalid Email' };

    return { data: new LoginUserDTO(email, password) };
  }
}
