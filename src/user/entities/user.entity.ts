import { Role } from 'src/auth/role/roles.enum'
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class User{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({
        nullable: true,
    })
    profilePicture: string;

    @Column()
    password: string

    @Column({ type: 'enum', enum: Role, default: Role.Worker })
    role: Role;
}