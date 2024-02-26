import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { BackupService } from "./backup.service";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
import { UpdateService } from "./update.service";
import { Setting } from "./entities/setting.entity";
import { TaskPack } from "../tasks/entities/task.entity";
import { WorkPack } from "../work/entities/work.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting, TaskPack, WorkPack]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService, BackupService, UpdateService],
  exports: [SettingsService, BackupService, UpdateService],
})
export class SettingsModule {}
