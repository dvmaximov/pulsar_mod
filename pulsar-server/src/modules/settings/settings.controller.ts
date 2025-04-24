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
  UseInterceptors, UploadedFile
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { createReadStream } from "fs";
import { ApiResult, initResult } from "../api/api.interface";
import { Setting } from "./entities/setting.entity";
import { SettingsService } from "./settings.service";
import { BackupService } from "./backup.service";
import { UpdateService } from "./update.service";
import { DriverService } from "../tools/driver.service";

@Controller("api/settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly backupService: BackupService,
    private readonly updateService: UpdateService,
    private readonly driverService: DriverService,
  ) {}

  @Get()
  getAll(): Promise<any> {
    return this.settingsService.getAll();
  }

  @Get("/updateServer")
  async updateServer(): Promise<any> {
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
  @UseInterceptors(
    FileInterceptor("restore", {
      storage: diskStorage({ destination: "./../restore", filename: (req, file, cb) => {
        const name = Buffer.from(file.originalname, "latin1").toString(
          "utf8",
          ); 
        cb(null, name)
      }}), 
    }),
  )
  async restore(@UploadedFile() file: Express.Multer.File): Promise<ApiResult> {
    const fileName = file.filename; 
    return await this.backupService.restore(fileName);
  }

  @Post("/repair")
  async repaint(): Promise<ApiResult> {
    return await this.backupService.repair();
  }

  @Get("/serverTime")
  async serverTime(): Promise<any> {
    return this.settingsService.serverTime();
  }

  @Get("/shutdown")
  async shutdown(): Promise<any> {
    return this.settingsService.shutdown().catch(() => {});
  }

  @Get("/reboot")
  async reboot(): Promise<any> {
    return this.settingsService.reboot().catch(() => {});
  }

  @Get("/restart")
  async restart(): Promise<any> {
    return this.settingsService.restart().catch(() => {});
  }


  @Get("/rotateCW/:angle")
  async rotateCW(@Param("angle") angle): Promise<ApiResult> {
    await this.driverService.rotateCW(+angle);
    const result = {...initResult, result: true}
    return result;
  }

  @Get("/rotateCCW/:angle")
  async rotateCCW(@Param("angle") angle): Promise<ApiResult> {
    await this.driverService.rotateCCW(+angle);
    const result = {...initResult, result: true}
    return result;
  }
  
  @Put(":id")
  async update(@Param("id") id, @Body() setting: Setting): Promise<any> {
    return this.settingsService.update(id, setting);
  }
}
