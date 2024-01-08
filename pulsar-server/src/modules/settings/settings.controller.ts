/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Response,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream } from "fs";
import { ApiResult } from "../api/api.interface";
import { Setting } from "./settings.interface";
import { SettingsService } from "./settings.service";
import { BackupService } from "./backup.service";
import { UpdateService } from "./update.service";

@Controller("api/settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly backupService: BackupService,
    private readonly updateService: UpdateService,
  ) {}

  @Get()
  getAll(): Promise<any> {
    return this.settingsService.getAll();
  }

  @Get("/updateServer")
  updateServer(): Promise<any> {
    return this.updateService.updateCode().catch(() => {});
  }

  @Get("/backup")
  backup(@Response({ passthrough: true }) res): StreamableFile {
    const backup = this.backupService.backup(); //.catch(() => {});
    const file = createReadStream(backup.dist);
    res.set({
      "Content-Type": "application/json",
      filename: "dsfs",
      "Content-Disposition": `attachment; filename="${backup.fileName}"`,
    });
    return new StreamableFile(file);
  }

  @Post("/restore")
  async restore(@Body() value: any): Promise<ApiResult> {
    return await this.backupService.restore(value);
  }

  @Post("/repair")
  async repaint(): Promise<ApiResult> {
    return await this.backupService.repair();
  }

  @Get("/serverTime")
  serverTime(): Promise<any> {
    return this.settingsService.serverTime();
  }

  @Get("/shutdown")
  shutdown(): Promise<any> {
    return this.settingsService.shutdown().catch(() => {});
  }

  @Get("/reboot")
  reboot(): Promise<any> {
    return this.settingsService.reboot().catch(() => {});
  }

  @Get("/restart")
  restart(): Promise<any> {
    return this.settingsService.restart().catch(() => {});
  }

  @Put(":id")
  async update(@Param("id") id, @Body() setting: Setting): Promise<any> {
    return this.settingsService.update(id, setting);
  }
}
