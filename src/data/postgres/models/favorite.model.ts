import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './user.model';
import { SecurityBox } from './securityBox.model';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => SecurityBox, (securityBox) => securityBox.favorites, {
    onDelete: 'CASCADE',
  })
  securityBox: SecurityBox;
}
