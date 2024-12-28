import { Injectable } from "@nestjs/common";
import { ApiResult, initResult } from "../api/api.interface";
import { SETTING } from "../settings/entities/setting.entity";
import * as cp from "child_process";
import { SettingsService } from "./settings.service";
import { readFile, writeFile, access, constants } from "node:fs/promises";
import * as FLAG from './update/update-flag.json'
import { join } from "path";

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm";
import { TaskPack } from "../tasks/entities/task.entity";
import { WorkPack } from "../work/entities/work.entity";

const exec = cp.exec;

const TARGET_VERSION = 1.1;

@Injectable()
export class UpdateService {
  constructor(
    private settings: SettingsService,
    @InjectRepository(TaskPack) private tasksRepository: Repository<TaskPack>,
    @InjectRepository(WorkPack) private worksRepository: Repository<WorkPack>,
  ) {
    this.autoRun();
  }

  private async autoRun() {
    if (!FLAG.doUpdate) return;
    setTimeout(async ()=> {
      try {
        await this.update()
      } catch {}
    }, 2000)
  }

  private async update() {
    const flagFile = join(__dirname, './update/update-flag.json');
    try {
      await access(flagFile, constants.W_OK);

      // Начало update

      // const dbPath = join(__dirname, '../../../db.json');
      // try {
      //   await access(dbPath, constants.R_OK | constants.W_OK);
      // } catch {
      //   console.log(`${dbPath} not found.`)
      //   await this.resetFlag(flagFile);
      //   return;
      // }
      // const json = (await readFile(dbPath)).toString();

      // const db = JSON.parse(json);
      
      // db.settings.forEach(async setting => {
      //   await this.settings.update(setting.id, setting);
      // });

      // db.tasks.forEach(async task => {
      //   const newTaskPack = TaskPack.taskToPack(task);
      //   let taskPack = this.tasksRepository.create(newTaskPack);
      //   await this.tasksRepository.save(taskPack);
      // })

      // db.works.forEach(async work => {
      //   const newWorkPack = WorkPack.workToPack(work);
      //   let workPack = this.worksRepository.create(newWorkPack);
      //   await this.worksRepository.save(workPack);
      // })

      // Окончание update
      await this.resetFlag(flagFile);

    } catch(e) {
      console.log(`file ${flagFile} not found`)
    }
  }

  private async resetFlag(fileName) {
    const flag = {...FLAG}
    flag.doUpdate = false;
    await writeFile(fileName, JSON.stringify(flag))
  }

  async updateCode(): Promise<ApiResult> {
    const answer = { ...initResult };
    answer.result = "Ok";
    try {
      // await this.cmd(`cd /root/pulsar/pulsar-server`);
      // await this.cmd(`rm -rf dist`);
      await this.cmd(`cd /root/pulsar`);
      await this.cmd(`git pull origin master`);

      await this.cmd(`cd /root/pulsar/pulsar-server`);
      await this.cmd(`npm run build`);


      // await this.cmd(`npm install`);


    } catch (e) {
      answer.result = null;
      answer.error = e;
    }

    try {
      await this.cmd(`pm2 restart 0`);
    } catch {}

    return answer;
  }

  // async updateCode(): Promise<ApiResult> {
  //   const answer = { ...initResult };
  //   answer.result = "Ok";
  //   try {
  //     // await this.cmd(`cd /root/pulsar/pulsar-server`);
  //     // await this.cmd(`rm -rf dist`);
  //     await this.cmd(`cd /root/pulsar`);
  //     await this.cmd(`git pull origin master`);

  //     await this.cmd(`cd /root/pulsar/pulsar-server`);
  //     await this.cmd(`npm run build`);


  //     // await this.cmd(`npm install`);


  //   } catch (e) {
  //     answer.result = null;
  //     answer.error = e;
  //   }

  //   try {
  //     await this.cmd(`pm2 restart 0`);
  //   } catch {}

  //   return answer;
  // }

  // async getCurrentVersion(): Promise<number> {
  //   return await (
  //     await this.settings.getById(SETTING.SETTING_VERSION)
  //   ).result.value;
  // }

  // async setNewVersion(value: string): Promise<any> {
  //   const newVersion = {
  //     // id: SETTING.SETTING_VERSION,
  //     name: "версия",
  //     type: "number",
  //     value,
  //   };
  //   await this.settings.update(SETTING.SETTING_VERSION, newVersion);
  // }

  // async updateVersion(): Promise<any> {
  //   let version = await this.getCurrentVersion();
  //   while (version < TARGET_VERSION) {
  //     switch (version) {
  //       case 1:
  //         // await this.update_1_1();
  //         version = 1.1;
  //         break;
  //       default:
  //         version = TARGET_VERSION;
  //     }
  //   }
  //   await this.setNewVersion(version.toString());
  // }

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
