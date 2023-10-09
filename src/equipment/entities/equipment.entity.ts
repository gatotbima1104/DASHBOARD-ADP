import { Track } from 'src/track/entity/track.entity';
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
  boot: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  violance: boolean;

  @Column({
    type: 'date',
  })
  timestamp: Date;

  @OneToOne(() => Track, {onDelete: 'CASCADE'})
  @JoinColumn()
  track: Track
}
