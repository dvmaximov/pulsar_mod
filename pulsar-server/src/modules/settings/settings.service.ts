import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocketService } from "../api/socket.service";
import { defaultSettings } from "./data/settings.data";
import { ApiResult } from "../api/api.interface";
import * as cp from "child_process";
import { on, emit, reconnect } from "src/modules/api/socket-client.service";
import { SETTING, Setting } from "./entities/setting.entity"
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";

const exec = cp.exec;

@Injectable()
export class SettingsService {

  constructor(
    private socket: SocketService,
    @InjectRepository(Setting) private readonly settingsRepository: Repository<Setting>,
  ) {
    setInterval(() => {
      this.socket.sendServerTime();
    }, 60 * 1000);

    this.settingsRepository.find().then((settings) => {
      if (settings.length === 0) {
        this.fillSettings();
        return;
      }
      //для шара - потом убрать
      const ball = settings.find(setting => setting.id === SETTING.SETTING_BALL);
      if (!ball) {
        const newSetting = new Setting();
        newSetting.id = SETTING.SETTING_BALL;
        newSetting.name = "текущее положение шара";
        newSetting.type = "number";
        newSetting.value = "0";
        this.create(newSetting);
      }
      const ball_angle = settings.find(setting => setting.id === SETTING.SETTING_BALL_STEPS);
      if (!ball_angle) {
        const newSetting = new Setting();
        newSetting.id = SETTING.SETTING_BALL_STEPS;
        newSetting.name = "угол шара";
        newSetting.type = "number";
        newSetting.value = "0";
        this.create(newSetting);
      }
      // type: "number",
      // name: "угол шара",
      // value: 0,
    });
  }

  public createEvents() {
    on("getStationSettings", async (data) => {
      const answer = await this.getAll();
      emit("stationSettings", { ...data, message: answer.settings });
    });
    on("updateStationSetting", async (data) => {
      const id = data.message.setting.id;
      const setting = data.message.setting;
      const answer = await this.update(id, setting);
      emit("stationSettingUpdated", { ...data, message: answer.result });
    });
  }

  private async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingsRepository.create(createSettingDto);
    return await this.settingsRepository.save(setting);  
  }    

  async getAll(): Promise<any> {
    const settings = await this.settingsRepository.find();
    return { settings , SETTING };
  }

  async getById(id: number): Promise<ApiResult> {
    const setting =  await this.findOne(id);
    if (!setting) {
      return { result: null, error: 'Настройка не найдена.'};
    }
    return { result: setting, error: null};
  }

  async findOne(id: number): Promise<Setting> {
    const user = await this.settingsRepository.findOne({ where: { id: id } });
    if (!user) {
      return ;
    }
    return (user);  
  }

  async getBall(): Promise<number> {
    const ball = await this.findOne(SETTING.SETTING_BALL);
    return +ball.value;
  }

  async getBallAngle(): Promise<number> {
    const angle = await this.findOne(SETTING.SETTING_BALL_STEPS);
    return +angle.value;
  }

  async update(id: number, updateSettingDto: UpdateSettingDto): Promise<ApiResult> {
    const setting = await this.settingsRepository.findOne({ where: { id: id } });
    if (updateSettingDto.type === "number") updateSettingDto.value = updateSettingDto.value + "";
    Object.assign(setting, updateSettingDto);
    const updated =  await this.settingsRepository.save(setting);
    if (!updated) {
      return { result: null, error: 'Ошибка сохранения настройки.'};
    }
    return { result: updated, error: null };
  }

  async shutdown(): Promise<any> {
    return await this.cmd(`shutdown now`);
  }

  async reboot(): Promise<any> {
    return await this.cmd(`reboot`);
  }

  async restart(): Promise<any> {
    return await this.cmd(`pm2 restart 0`);
  }

  async serverTime(): Promise<any> {
    return this.socket.sendServerTime();
  }

  private async fillSettings() {
    for (const setting of defaultSettings) {
      const newSetting = new CreateSettingDto();
      newSetting.name = setting.name;
      newSetting.type = setting.type;
      newSetting.value = setting.value.toString();
      await this.create(newSetting);
    }
  }

  private cmd(command): Promise<any> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout);
      });
    });
  }
}
