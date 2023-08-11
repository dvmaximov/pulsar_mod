import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { SocketService } from "../api/socket.service";
import { defaultSettings } from "./data/settings.data";
import { SETTING } from "./settings.interface";
import { ApiResult } from "../api/api.interface";
import * as cp from "child_process";

const exec = cp.exec;

@Injectable()
export class SettingsService {
  constructor(private api: ApiService, private socket: SocketService) {
    setInterval(() => {
      this.socket.sendServerTime();
    }, 60 * 1000);
  }

  async getAll(): Promise<any> {
    let answer = await this.api.getAll("settings");
    if (!answer.result || !Array.isArray(answer.result)) return answer;

    const settings = answer.result;
    if (settings.length === 0) {
      await this.fillSettings();
      answer = await this.api.getAll("settings");
    }
    answer.result = answer.result.filter(
      (item) => item.id !== SETTING.SETTING_PASS,
    );
    return { settings: answer, SETTING };
  }

  async getById(id: number): Promise<ApiResult> {
    return await this.api.getById("settings", id);
  }

  async update(id: number, value: unknown): Promise<ApiResult> {
    return this.api.update("settings", id, value);
  }

  async shutdown(): Promise<any> {
    return await this.cmd(`shutdown now`);
  }

  async reboot(): Promise<any> {
    return await this.cmd(`reboot`);
  }

  async serverTime(): Promise<any> {
    return this.socket.sendServerTime();
  }

  private async fillSettings(): Promise<any> {
    for (const setting of defaultSettings) {
      await this.api.create("settings", setting);
    }
    return null;
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
