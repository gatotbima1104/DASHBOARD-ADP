import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  camera_name: string;

  @Column()
  camera_location: string;
}
