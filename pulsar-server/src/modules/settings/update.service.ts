import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { ApiResult, initResult } from "../api/api.interface";
import { SETTING } from "../settings/settings.interface";
import * as cp from "child_process";
import { SettingsService } from "./settings.service";

const exec = cp.exec;

const TARGET_VERSION = 1.1;

@Injectable()
export class UpdateService {
  constructor(private api: ApiService, private settings: SettingsService) {
    this.autoRun();
  }

  private async autoRun() {
    try {
      await this.updateVersion();
    } catch {}
  }

  async updateCode(): Promise<ApiResult> {
    const answer = { ...initResult };
    answer.result = "Ok";
    try {
      await this.cmd(`cd /root/pulsar/pulsar-server`);
      await this.cmd(`rm -rf dist`);
      await this.cmd(`cd /root/pulsar`);
      await this.cmd(`git pull origin master`);
      await this.cmd(`cd /root/pulsar/pulsar-server`);
      await this.cmd(`npm install`);
    } catch (e) {
      answer.result = null;
      answer.error = e;
    }

    try {
      await this.cmd(`pm2 restart 0`);
    } catch {}

    return answer;
  }

  async getCurrentVersion(): Promise<number> {
    return await (
      await this.settings.getById(SETTING.SETTING_VERSION)
    ).result.value;
  }

  async setNewVersion(value: number): Promise<any> {
    const newVersion = {
      id: SETTING.SETTING_VERSION,
      name: "версия",
      value,
    };
    await this.api.update("settings", SETTING.SETTING_VERSION, newVersion);
  }

  async updateVersion(): Promise<any> {
    let version = await this.getCurrentVersion();
    while (version < TARGET_VERSION) {
      switch (version) {
        case 1:
          await this.update_1_1();
          version = 1.1;
          break;
        default:
          version = TARGET_VERSION;
      }
    }
    await this.setNewVersion(version);
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

  async update_1_1(): Promise<any> {
    const port = {
      id: SETTING.SETTING_PORT,
      name: "HTTP port",
      value: 80,
    };
    await this.api.create("settings", port);
    const pass = {
      id: SETTING.SETTING_SERVER,
      name: "Общий сервер",
      value: "",
    };
    await this.api.create("settings", pass);
  }
}
