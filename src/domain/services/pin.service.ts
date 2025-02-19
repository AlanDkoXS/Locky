import { decryptData, encryptData } from '../../config/encryption';
import { generateSecurePassword } from '../../config/password.utils';
import { CredentialStorage } from '../../data/postgres/models/credentialStorage.model';
import { Pin } from '../../data/postgres/models/pin.model';

import { CustomError } from '../errors/custom.error';

export class PinService {
  async createPin(credentialId: string): Promise<Pin> {
    try {
      const code = generateSecurePassword();
      console.log('Generated password', code);
      const encryptedCode = encryptData(code);

      console.log('Encrypted PIN code:', encryptedCode);

      const credential = await CredentialStorage.findOne({
        where: { id: credentialId },
      });
      if (!credential) {
        throw CustomError.notFoud('Credential not found');
      }

      const pin = new Pin();
      pin.code = encryptedCode;
      pin.hashedCode = code;
      pin.credential = credential;

      const savedPin = await pin.save();
      console.log('PIN saved', savedPin);

      return savedPin;
    } catch (error) {
      console.error('Error in createPin service:', error);
      throw CustomError.internalServer('Error creating PIN');
    }
  }

  async validatePin(pinId: string, code: string): Promise<boolean> {
    console.log('Searching PIN:', pinId);

    const pin = await Pin.findOne({ where: { id: pinId } });

    console.log('Search results:', pin);

    if (!pin) throw CustomError.internalServer('PIN not found');

    const decryptedCode = decryptData(pin.code);
    return decryptedCode === code;
  }
}
