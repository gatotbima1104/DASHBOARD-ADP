import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { User } from "src/user/entities/user.entity";
import { Role } from "src/auth/role/roles.enum";

@Injectable() 
export class UserSeeder {
    constructor(@InjectRepository(User) private userRepo: Repository<User> ){}

    async seed() {
        await this.userRepo.delete({});
    
        const salt = await bcrypt.genSalt()
        const newUser = new User();
        newUser.name = 'super admin'
        newUser.email = 'super@admin.com';
        newUser.password = 'Superadmin123';
        newUser.password = await bcrypt.hash(newUser.password, salt);
        newUser.role = Role.Admin;
    
        await this.userRepo.save(newUser)
      }
    
}