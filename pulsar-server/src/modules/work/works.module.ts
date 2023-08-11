import { Module } from "@nestjs/common";

import { WorksService } from "./works.service";
import { WorksController } from "./works.controller";
import { RunnerService } from "./runner.service";
import { DictonaryModule } from "../dictonary/dictonary.module";
import { DeviceService } from "./device.service";
import { SettingsModule } from "../settings/settings.module";

@Module({
  imports: [DictonaryModule, SettingsModule],
  controllers: [WorksController],
  providers: [WorksService, RunnerService, DeviceService],
})
export class WorksModule {}
