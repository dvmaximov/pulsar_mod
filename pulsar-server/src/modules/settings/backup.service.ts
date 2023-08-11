import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { SocketService } from "../api/socket.service";

import { copyFileSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import * as path from "path";
import * as cp from "child_process";

import { initResult } from "../api/api.interface";

const exec = cp.exec;

@Injectable()
export class BackupService {
  constructor(private api: ApiService, private socket: SocketService) {}

  private generateName(): string {
    let name = new Date().toLocaleString();
    name = name
      .replace(/ /g, "")
      .replace(/,/g, "_")
      .replace(/\./g, "-")
      .replace(/:/g, "-")
      .replace(/\//g, "-");
    name = `backupDB_${name}.json`;
    return name;
  }

  backup(filename = null) {
    const name = filename ? filename : this.generateName();

    const source = path.resolve(__dirname, "../../../db.json");
    const dist = path.resolve(__dirname, `../../../../backup/${name}`);
    const distPath = path.resolve(__dirname, `../../../../backup`);

    try {
      mkdirSync(distPath);
    } catch {}

    copyFileSync(source, dist);
    let db: any = {};

    try {
      db = readFileSync(dist, "utf8").toString();
      db = JSON.parse(db);
      db["currentWork"] = [];
      db = JSON.stringify(db);
      writeFileSync(dist, db);
    } catch (e) {
      console.log(e);
    }

    return { fileName: name, dist };
  }

  async restore(value): Promise<any> {
    const answer = { ...initResult };

    answer.result = "Ok";
    try {
      const source = path.resolve(__dirname, "../../../db.json");
      writeFileSync(source, JSON.stringify(value));
      await this.cmd(`pm2 restart 0`);
    } catch (e) {
      answer.result = null;
      answer.error = e;
    }

    return answer;
  }

  async repair(): Promise<any> {
    const name = "auto_backup.json";
    let answer = { ...initResult };

    const source = path.resolve(__dirname, `../../../../backup/${name}`);
    let db = "";
    try {
      db = readFileSync(source, "utf8").toString();
    } catch {
      return answer;
    }

    db = JSON.parse(db);

    answer = await this.restore(db);
    return answer;
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
