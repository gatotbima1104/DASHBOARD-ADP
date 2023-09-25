import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guard/skip.auth';

import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.authService.loginUser(dto);
    }

    @Public()
    @Post('register')
    register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
    }
}
