import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import * as randomstring from 'randomstring'
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
      this.server.on('connection', (socket) => {
        console.log('client ID: ', socket.id)      
        
        //PUBLISH REDIS
        const publisher = redis.createClient()
        //SUBSCIREB REDIS
        const subscriber = publisher.duplicate()
        await subscriber.connect()

        //SETTING UP TIMES SUBSCRIBEpublisher 
        setInterval( async () =>{
          await subscriber.subscribe('', (message) => {
            console.log(message)
          })
          
          const data = {
            id: this.randomNumber(),
            text: this.randomString(5)
          }
          //PUBLISHER REDIS
          // await publisher.connect()
          // await publisher.publish(
          //   'data', JSON.stringify(data)
          // )
          console.log('data', data);
          this.server.emit('updateData', data)
        }, 5000)
      })
  }

  randomNumber(){
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }

  randomString(words: number){
    return randomstring.generate(words)
  }

  // CHAT MESSAGE IS FOR SENDING MESSAGE
  @SubscribeMessage("chatMessage")
  onChatMessage(@MessageBody() body: any){
    console.log(body)
    
    // ONCHAT IS FOR LISTENING
    this.server.emit("onChat", {  
      content: body
    })
  }

  @SubscribeMessage('setAlarm')
  onSetAlarm(@MessageBody() data: any, client: Socket): void {
    console.log('Received data from client:', data);

    if (data && data.timeout) {
      const { timeout } = data;
      // SET TIMEOUT ALARM
      setTimeout(() => {
        // client.emit('alarmRinging', { message: 'alarm ringing!!!' });
        if (client) {
          client.emit('alarmRinging', { message: 'alarm ringing!!!' });
        } else {
          console.log('Client object is undefined.');
        }
      }, timeout * 1000);
    } else {
      console.log('Invalid data received from client.');
    }
  }

  @SubscribeMessage('random')
  onRandom(@MessageBody() data: any){

    setTimeout(()=>{
      const sendRandom = () =>{
        const random = Math.random()
        
        console.log(random)
        this.server.emit('randomNumber', random)
      }
    }, 5000)
  }

}