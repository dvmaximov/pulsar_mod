import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorksService } from "./works.service";
import { WorksController } from "./works.controller";
import { RunnerService } from "./runner.service";
import { DictonaryModule } from "../dictonary/dictonary.module";
import { DeviceService } from "./device.service";
import { SettingsModule } from "../settings/settings.module";
import { WorkPack } from "./entities/work.entity";
import { ToolsModule } from "../tools/tools.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([WorkPack]),
    DictonaryModule, 
    SettingsModule,
    ToolsModule,
  ],
  controllers: [WorksController],
  providers: [WorksService, RunnerService, DeviceService],
  exports: [WorksService, RunnerService,],
})
export class WorksModule {}
