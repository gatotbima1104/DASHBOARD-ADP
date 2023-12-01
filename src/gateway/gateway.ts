import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import * as redis from 'redis'

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
      // console.log(`Connect to ID : ${socket.id}`)
    })
    //subs a channel 
    this.subsForwardToFrontend(process.env.REDIS_CHANNEL, process.env.REDIS_CHANNEL2)  // replace with your channel
    // this.subsSecondChannel(process.env.REDIS_CHANNEL2)  // replace with your channel

    // subs more than a channel
    // const moreChannel = [process.env.REDIS_CHANNEL, process.env.REDIS_CHANNEL2]
    // this.subsForwardToFrontend(moreChannel)  // replace with your channel
  }

  // subs redis - bridge to socket .io
  async subsForwardToFrontend (channel: string, channel2: string) {
    try {
      await this.subscriber.connect()  // connect to redis server
      this.subscriber.subscribe(channel, (message: any) => {
        console.log(message)
        this.server.emit(`${channel}`, { image: true, buffer: message.toString('base64') })  // forward to frontend channel Socket.io
      })
      this.subscriber.subscribe(channel2, (message: any) => {
        console.log(message)
        this.server.emit(`${channel2}`, { buffer: message.toString('base64') })  // forward to frontend channel2 Socket.io
      })
      console.log(`subscribed to channel2: ${channel} and ${channel2}`)
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