import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
// import { jwtConstants } from './jwt/jwt.constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: `$process.env.jwt_secret`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // },
  ],
  controllers: [AuthController
  ],
})
export class AuthModule {}
