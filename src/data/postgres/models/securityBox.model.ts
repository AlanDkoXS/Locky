import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { User } from './user.model';
import { Favorite } from './favorite.model';
import { CredentialStorage } from './credentialStorage.model';

export const PREDEFINED_ICONS = [
  'key',
  'email',
  'credit_card',
  'globe',
  'bank',
  'wifi',
  'shield',
  'file',
];

@Entity()
export class SecurityBox extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false })
  favorite: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  private _icon: string;

  set icon(value: string) {
    if (!PREDEFINED_ICONS.includes(value)) {
      throw new Error(
        `Invalid icon. Choose from: ${PREDEFINED_ICONS.join(', ')}`
      );
    }
    this._icon = value;
  }

  get icon(): string {
    return this._icon;
  }

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'active' })
  status: string;

  @ManyToOne(() => User, (user) => user.securityBoxes, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CredentialStorage, (credential) => credential.securityBox)
  credentials: CredentialStorage[];

  @OneToMany(() => Favorite, (favorite) => favorite.securityBox, {
    cascade: true,
  })
  favorites: Favorite[];
}
