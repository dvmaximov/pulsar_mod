import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { TaskPack } from "./entities/task.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TaskPack])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
