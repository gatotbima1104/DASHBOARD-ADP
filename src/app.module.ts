import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/role.guard';
import { ProductsModule } from './products/products.module';
import { EquipmentModule } from './equipment/equipment.module';
import typeOrmConfig from './config/database/typeorm.config';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig) ,UserModule, AuthModule, ProductsModule, EquipmentModule],
  controllers: [],
  providers: [RolesGuard],
})
export class AppModule {}
