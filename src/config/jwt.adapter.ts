import jwt from 'jsonwebtoken';

const JWT_SEED: jwt.Secret = process.env.JWT_SEED || 'default_secret';

export class JwtAdapter {
  static async generateToken(
    payload: any,
    duration: jwt.SignOptions['expiresIn'] = '3h'
  ) {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  }

  static async validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err: any, decoded: any) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    });
  }
}
