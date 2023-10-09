import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TrackRole } from "../role/track.enum";

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  profilePicture: string;

  @Column({ type: 'enum', enum: TrackRole, default: TrackRole.Worker })
  jabatan: TrackRole

  @Column({
    type: 'boolean',
    default: false,
  })
  isSafe: boolean
}