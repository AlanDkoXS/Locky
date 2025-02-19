import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { SecurityBox } from './securityBox.model';
import { Pin } from './pin.model';

@Entity()
export class CredentialStorage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  account: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 20, nullable: true })
  code_1: string;

  @Column({ length: 20, nullable: true })
  code_2: string;

  @ManyToOne(() => SecurityBox, (securityBox) => securityBox.credentials, {
    onDelete: 'CASCADE',
  })
  securityBox: SecurityBox;

  @ManyToOne(() => Pin, { nullable: true, onDelete: 'CASCADE' })
  pin: Pin;
}
