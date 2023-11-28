import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { CacheModule } from '@nestjs/cache-manager'
import { GatewayService } from "./gateway.service";

@Module({
  imports: [CacheModule.register({
    host: 'localhost',
    port: 6379
  })],
  providers: [MyGateway],
})
export class GatewayModule{
}