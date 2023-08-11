import { Global, Module } from "@nestjs/common";
import { ApiService } from "./api.service";
import { SocketService } from "./socket.service";

@Global()
@Module({
  providers: [ApiService, SocketService],
  exports: [ApiService, SocketService],
})
export class ApiModule {}
