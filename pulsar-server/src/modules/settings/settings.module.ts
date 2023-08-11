import { Module } from "@nestjs/common";
import { BackupService } from "./backup.service";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
import { UpdateService } from "./update.service";

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, BackupService, UpdateService],
  exports: [SettingsService, BackupService, UpdateService],
})
export class SettingsModule {}
