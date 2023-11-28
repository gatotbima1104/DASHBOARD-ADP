import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import redis from 'redis'

@Injectable()
export class GatewayService{
    @WebSocketServer()
    server: Server
    private readonly subscriber: redis.RedisClientType

    constructor(){
        this.subscriber = redis.createClient()
    }

    async subsChannel(channel: string){
        try {
            await this.subscriber.connect()
            await this.subscriber.subscribe(channel, (data)=> {
                console.log(`Subscribe to channel: ${channel}`)
                console.log(data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async unsubsChannel(channel: string){
        try {
            await this.subscriber.connect()
            await this.subscriber.unsubscribe(channel, ()=> {
                console.log(`Unsubscribe to channel: ${channel}`)
            })
        } catch (error) {
            console.log(error)
        }
    }
}
