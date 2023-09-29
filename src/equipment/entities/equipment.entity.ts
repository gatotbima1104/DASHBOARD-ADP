import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  helm: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  vest: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  violance: boolean;

  @Column({
    type: 'timestamp',
  })
  timestamp: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
