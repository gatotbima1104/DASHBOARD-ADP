import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
  
  onModuleInit() {
    console.log('onModuleInit triggered')
    this.server.on('connection', (socket)=> {
      console.log(`Connect to ID : ${socket.id}`)
    })
    this.bridgeRedis()
  }

  // subs redis - bridge to socket .io
  async bridgeRedis () {
    const subscriber = redis.createClient()
    await subscriber.connect()

    subscriber.subscribe('article_user', (message: any) => {
      console.log(message)

      this.server.emit('article-user-fe', { message })
    })
  }
}