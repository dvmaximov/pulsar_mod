import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { DictonaryController } from "./dictonary.controller";
import { DictonaryService } from "./dictonary.service";
import { ActionType } from "./entities/action-types.entity";
import { StatusType } from "./entities/status-types.entity";
import { WorkType } from "./entities/work-types.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ActionType, StatusType, WorkType])],
  controllers: [DictonaryController],
  providers: [DictonaryService],
  exports: [DictonaryService],
})
export class DictonaryModule {}
