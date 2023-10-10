import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'

@WebSocketGateway()
export class MyGateway implements OnModuleInit{
  @WebSocketServer()
  server: Server;
  private connections: Map<string, Socket> = new Map();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected')

      const socketId = socket.id
      console.log(`connected with ID: ${socketId}`)

      const sockeSetted = this.connections.set(socketId, socket)
      console.log(sockeSetted)
    })
  }

  closeConnection(socketId: string) {
    const socket = this.connections.get(socketId)
    if(socket) {
      socket.disconnect()
      this.connections.delete(socketId)
      console.log(`Close connection with ID: ${socket}`)
    }else{
      console.log(`Not found with ID : ${socket} `)
    }
  }

  openConnection(socketId: string){
    const socket = this.connections.get(socketId)
    if(socket){
      //TODOS LOGIC
    }else{
      console.log(`Not found with ID : ${socket} `)
    }
  }
  

  @SubscribeMessage('liveTracking')
  onTrack(@MessageBody() body: any){
    console.log(body)
    this.server.emit('onTracking', {
      msg: "new message",
      // content: body
    })
    
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any){
    console.log(body)
    this.server.emit('onMessage', {
      msg: "new message",
      content: body
    })
  }
}