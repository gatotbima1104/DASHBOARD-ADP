import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import * as redis from 'redis'
import { GatewayService } from "./gateway.service";

@WebSocketGateway(3001, {
  cors: {
    origin: '*'
  }
})

export class MyGateway implements OnModuleInit{
  @WebSocketServer()
  server: Server;
  private readonly subscriber: redis.RedisClientType  //define redis to subscribe instance
  
  constructor(
    // private readonly gatewayService: GatewayService
  ){
    this.subscriber = redis.createClient()    //sign the subscriber variabel to constructor
  }
  
  onModuleInit() {
    console.log('onModuleInit triggered')
    this.server.on('connection', (socket)=> {
      console.log(`Connect to ID : ${socket.id}`)
    })
    //subs a channel 
    this.subsForwardToFrontend(process.env.REDIS_CHANNEL)  // replace with your channel

    // subs more than a channel
    // const moreChannel = [process.env.REDIS_CHANNEL, process.env.REDIS_CHANNEL2]
    // this.subsForwardToFrontend(moreChannel)  // replace with your channel
  }

  // subs redis - bridge to socket .io
  async subsForwardToFrontend (channel: string) {
    await this.subscriber.connect()  // connect to redis server
    
    try {
      // const subscriber = redis.createClient()
      // await subscriber.connect()
      this.subscriber.subscribe(channel, (message: any) => {
        console.log(message)
        this.server.emit(`${channel}`, { message })  // forward to frontend channel Socket.io
      })

      console.log(`subscribed to channel: ${channel}`)
    } catch (error) {
      console.log('error connecting to Redis', error.message)
    }
  }

  // @SubscribeMessage('unsubscribeChannel')
  // async unsubChannel(channel: string){
  //   try {
  //     await this.gatewayService.subsChannel(channel)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // @SubscribeMessage('subscribeToChannel')
  // async subsChannel(channel: string){
  //   try {
  //     await this.gatewayService.unsubsChannel(channel)
  //   } catch (error) {
  //     console.log(error)     
  //   }
  // }
}