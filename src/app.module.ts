import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/role.guard';
import typeOrmConfig from './config/database/typeorm.config';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig) ,UserModule, AuthModule],
  controllers: [],
  providers: [RolesGuard],
})
export class AppModule {}
