import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guard/skip.auth';

import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post('login')
    @ApiCreatedResponse({
        description: 'User Logged in'
    })
    @ApiBadRequestResponse({
        description: 'Email or Password is incorrect'
    })
    login(@Body() dto: LoginUserDto) {
        return this.authService.loginUser(dto);
    }

    @Public()
    @Post('register')
    @ApiCreatedResponse({
        description: 'Created user'
    })
    @ApiBadRequestResponse({
        description: 'User cannot register/created, Try again !'
    })
    register(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
    }
}
