import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guard/skip.auth';
import { LoginUserDto } from './dto/login.user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.user.dto';

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
    register(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
    }
}
