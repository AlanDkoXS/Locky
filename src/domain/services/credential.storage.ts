import { decryptData, encryptData } from '../../config/encryption';
import { CredentialStorage } from '../../data/postgres/models/credentialStorage.model';
import { Pin } from '../../data/postgres/models/pin.model';
import { SecurityBox } from '../../data/postgres/models/securityBox.model';
import { validate as isUUID } from 'uuid';
import { CustomError } from '../errors/custom.error';
import bcrypt from 'bcryptjs';

export class CredentialStorageService {
  async createCredential(
    account: string,
    password: string,
    securityBoxId: string,
    description?: string,
    code1?: string,
    code2?: string
  ): Promise<CredentialStorage> {
    if (!password) {
      throw CustomError.badRequest('Password required');
    }

    const securityBox = await SecurityBox.findOne({
      where: { id: securityBoxId },
    });
    if (!securityBox) {
      throw CustomError.notFoud('SecurityBox not found');
    }

    const encryptedPassword = encryptData(password);

    const credential = new CredentialStorage();
    credential.account = account;
    credential.password = encryptedPassword;
    credential.description = description ?? '';
    credential.code_1 = code1 ?? '';
    credential.code_2 = code2 ?? '';
    credential.securityBox = securityBox;

    try {
      return await credential.save();
    } catch (error) {
      console.error('Error creating credential:', error);
      throw CustomError.internalServer('Error creating credential');
    }
  }

  async getCredentials(securityBoxId: string): Promise<CredentialStorage[]> {
    console.log('Security box:', securityBoxId);

    if (!securityBoxId) {
      throw CustomError.badRequest('Security box undefined');
    }

    if (!isUUID(securityBoxId)) {
      throw CustomError.badRequest('Invalid UUID');
    }

    try {
      const credentials = await CredentialStorage.find({
        where: { securityBox: { id: securityBoxId } },
        relations: ['securityBox'],
      });

      return credentials.length ? credentials : [];
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw CustomError.internalServer('Error retrieving credentials');
    }
  }

  async updateCredential(
    id: string,
    account?: string,
    password?: string,
    description?: string,
    code1?: string,
    code2?: string,
    pinCode?: string
  ): Promise<CredentialStorage> {
    if (!id || typeof id !== 'string') {
      throw CustomError.badRequest('Invalid ID');
    }

    const isValidUUID = (uuid: string) => /^[0-9a-fA-F-]{36}$/.test(uuid);
    if (!isValidUUID(id)) {
      throw CustomError.badRequest('Invalid UUID');
    }

    const credential = await CredentialStorage.findOne({ where: { id } });

    if (!credential) {
      throw CustomError.notFoud('Credentials not found');
    }

    if (credential.pin && pinCode) {
      const isValid = await bcrypt.compare(pinCode, credential.pin.hashedCode);
      if (!isValid) {
        throw CustomError.unAuthorized('Invalid PIN');
      }
    }

    if (account) credential.account = account;
    if (password) credential.password = encryptData(password);
    if (description) credential.description = description;
    if (code1) credential.code_1 = code1;
    if (code2) credential.code_2 = code2;

    try {
      return await credential.save();
    } catch (error) {
      throw CustomError.internalServer('Error updating credential');
    }
  }

  async deleteCredential(id: string): Promise<void> {
    const credential = await CredentialStorage.findOne({ where: { id } });
    if (!credential) throw CustomError.notFoud('Credential not found');

    try {
      await credential.remove();
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw CustomError.internalServer('Error deleting credential');
    }
  }
}
