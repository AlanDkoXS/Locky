import {
  Entity,
  OneToMany,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SecurityBox } from './securityBox.model';
import { Favorite } from './favorite.model';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  lastname: string;

  @Column('varchar', {
    length: 80,
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => SecurityBox, (securityBox) => securityBox.user, {
    cascade: true,
  })
  securityBoxes: SecurityBox[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];
}
