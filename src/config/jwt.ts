import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT not found');
}

export const encryptWithJWT = (data: any) => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '3h' });
};

export const decryptWithJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
