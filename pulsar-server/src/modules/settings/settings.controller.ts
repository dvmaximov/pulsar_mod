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
import { SETTING } from "./settings.interface";
import { connectClient } from "src/modules/api/socket-client.service";

@Controller("api/settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly backupService: BackupService,
    private readonly updateService: UpdateService,
  ) {
    let host = "";
    let port = "";
    let station = "";
    this.getAll().then((items) => {
      const settings = items.settings.result;
      let result: Setting = settings.find(
        (setting) => setting.id === SETTING.SETTING_SERVER,
      );
      host = result.value;
      result = settings.find((setting) => setting.id === SETTING.SETTING_PORT);
      port = result.value;
      result = settings.find(
        (setting) => setting.id === SETTING.SETTING_STATION,
      );
      station = result.value;
      connectClient(host, port, station);
    });
  }

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

  @Put(":id")
  async update(@Param("id") id, @Body() setting: Setting): Promise<any> {
    return this.settingsService.update(id, setting);
  }
}
