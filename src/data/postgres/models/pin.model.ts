import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { CredentialStorage } from './credentialStorage.model';

@Entity()
export class Pin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  hashedCode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @ManyToOne(() => CredentialStorage, { onDelete: 'CASCADE' })
  credential: CredentialStorage;
}
