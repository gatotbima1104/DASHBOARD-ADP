import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/role.guard';
import { EquipmentModule } from './equipment/equipment.module';
import typeOrmConfig from './config/database/typeorm.config';
import { GatewayModule } from './gateway/gateway.module';
import { TrackModule } from './track/track.module';
import { MyGateway } from './gateway/gateway';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig) ,UserModule, AuthModule, EquipmentModule, GatewayModule, TrackModule],
  controllers: [],
  providers: [RolesGuard],
})
export class AppModule {}
