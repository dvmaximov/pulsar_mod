import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class SocketService {
  @WebSocketServer()
  private server: Server;

  // @SubscribeMessage("event")
  // handleEvent(@MessageBody() data: string): void {
  //   this.server.sockets.emit("hi", "hi");
  // }

  private sendEvent(id: string, data?: string): void {
    this.server.sockets.emit(id, data);
  }

  workStatusUpdate( data?: any): void {
    this.sendEvent("workStatusUpdate", data);
  }

  settingsUpdate(): void {
    this.sendEvent("settingsUpdate");
  }

  sendServerTime(): void {
    this.sendEvent("serverTime", Date.now() + "");
  }
}
