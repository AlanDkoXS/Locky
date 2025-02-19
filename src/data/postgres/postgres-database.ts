import { DataSource } from 'typeorm';
import { User } from './models/user.model';
import { Pin } from './models/pin.model';
import { SecurityBox } from './models/securityBox.model';
import { CredentialStorage } from './models/credentialStorage.model';
import { Favorite } from './models/favorite.model';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDatabase {
  public datasource: DataSource;

  constructor(option: Options) {
    this.datasource = new DataSource({
      type: 'postgres',
      host: option.host,
      port: option.port,
      username: option.username,
      password: option.password,
      database: option.database,
      entities: [User, Pin, SecurityBox, CredentialStorage, Favorite, Pin],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  async connect() {
    try {
      await this.datasource.initialize();
      console.log('✔ Database connected');
    } catch (error) {
      console.error('𐄂 Error connecting database:', error);
    }
  }
}
