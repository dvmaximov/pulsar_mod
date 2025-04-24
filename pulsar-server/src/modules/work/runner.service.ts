import { Injectable } from "@nestjs/common";
import { SocketService } from "../api/socket.service";
import { DictonaryService } from "../dictonary/dictonary.service";
import { SettingsService } from "../settings/settings.service";
import { SETTING, BallPosition } from "../settings/entities/setting.entity"
import { Work } from "./entities/work.entity";
import { WorksService } from "./works.service";
import { ACTION, ActionType } from "../dictonary/entities/action-types.entity";
import { STATUS, StatusType } from "../dictonary/entities/status-types.entity";
import { DeviceService } from "./device.service";
import { DriverService } from "../tools/driver.service";
import { ApiResult } from "../api/api.interface";
import { BackupService } from "../settings/backup.service";
import { on, emit } from "src/modules/api/socket-client.service";

const ALONE_ID = 1;

@Injectable()
export class RunnerService {
  private timers = [];
  private statusTypes = null;
  private actionTypes = null;
  private stopped = false;

  constructor(
    private works: WorksService,
    private dictonary: DictonaryService,
    private socket: SocketService,
    private device: DeviceService,
    private driver: DriverService,
    private settings: SettingsService,
    private backupService: BackupService,
  ) {
    this.prepare();
  }

  public createEvents() {
    on("createStationWorks", async (data) => {
      const answer = await this.works.create(data.message.work);
      if (answer.result) {
        this.addWork(answer.result);
        emit("stationWorksCreated", { ...data, message: answer.result });
      }
    });
    on("deleteStationWorks", async (data) => {
      const answer = await this.works.delete(data.message.id);
      this.removeWork(data.message.id);
      emit("stationWorksDeleted", { ...data, message: answer.result });
    });
  }

  private async prepare() {
    await this.removeCurrentWork();
    const answer = await this.dictonary.getAll();
    const { statusTypes, actionTypes } = answer.result;
    this.statusTypes = statusTypes;
    this.actionTypes = actionTypes;
    this.timers = await this.fillTimers();
    await this.checkWorkForRun();
  }

  private createTimer(work) {
    const now = new Date().getTime();
    const start = work.startTime;
    if (!start) return null;
    const wait = start - now;
    const timer =
      wait <= 0
        ? null
        : setTimeout(() => {
            this.startWork(work);
            this.removeTimer(work.id);
          }, wait);
    return timer;
  }

  private removeTimer(workId) {
    const timer = this.timers.find((item) => item.workId === +workId);
    if (timer) {
      clearTimeout(timer.timerId);
      this.timers = this.timers.filter((item) => item.workId !== +workId);
    }
  }

  public removeWork(workId) {
    if (this.works.currentWork && this.works.currentWork.work.id === +workId) {
      this.removeCurrentWork();
    }
    this.removeTimer(workId);
  }

  public addWork(work): void {
    if (work.status.id == STATUS.STATUS_WAIT) {
      const timer = this.createTimer(work);
      if (timer) {
        this.timers.push({
          timerId: timer,
          workId: work.id,
        });
      }
    } else if (work.status.id == STATUS.STATUS_RUN) {
      this.startWork(work).catch(() => ({}));
    }
  }

  private getStatus(statusId: number): StatusType {
    return this.statusTypes.find((item) => item.id === statusId);
  }

  private getAction(actionId: number): ActionType {
    return this.actionTypes.find((item) => item.id === actionId);
  }

  private async updateStatus(work, statusId) {
    const newStatus = this.statusTypes.find((item) => item.id === statusId);
    if (!newStatus) return;
    work.status = newStatus;
    await this.works.update(work.id, work);
    this.socket.workStatusUpdate(this.works.currentWork);
  }

  private async fillTimers() {
    const answer: ApiResult = await this.works.getAll();
    if (!answer.result || !Array.isArray(answer.result)) return;
    let works = answer.result;
    works = works.filter((item) => item.status.id === STATUS.STATUS_WAIT);
    const timers = [];
    works.forEach((item) => {
      const timer = this.createTimer(item);
      if (timer) {
        timers.push({
          timerId: timer,
          workId: item.id,
        });
      } else {
        this.updateStatus(item, STATUS.STATUS_EXPIRED);
      }
    });
    return timers;
  }

  private async checkWorkForRun() {
    const answer = await this.works.getAll();
    if (!answer.result || !Array.isArray(answer.result)) return answer;
    let works = answer.result;
    works = works.filter((item) => item.status.id === STATUS.STATUS_RUN);
    works.forEach((item) => {
      this.updateStatus(item, STATUS.STATUS_STOPPED);
    });
  }

  private async startWork(work: Work) {
    this.stopped = false;
    if (this.works.currentWork) {
      await this.updateStatus(work, STATUS.STATUS_EXPIRED);
      return;
    }
    await this.ballDrive(work.item.ball);
    await this.createCurrentWork({ ...work });
    await this.updateStatus(work, STATUS.STATUS_RUN);
    await this.startLoop();
    if (!this.stopped) await this.updateStatus(work, STATUS.STATUS_DONE);
    await this.removeCurrentWork();
  }

  private async createCurrentWork(work: Work): Promise<any> {
    this.works.currentWork = {
      id: ALONE_ID,
      work,
    };
    await this.prepareDetails();
    await this.updateCurrentWork();
  }

  private async updateCurrentWork(): Promise<any> {
    this.socket.workStatusUpdate(this.works.currentWork);
  }

  private async removeCurrentWork(): Promise<any> {
    try {
      this.works.currentWork = null;
    } catch {}
  }

  private async prepareDetails(): Promise<any> {
    if (!this.works.currentWork) return;
    const actions = this.works.currentWork.work.item.actions;
    const defaultStatus = this.getStatus(STATUS.STATUS_WAIT);
    const waitAction = this.getAction(ACTION.ACTION_WAIT);
    const details = [];
    let isAddZeroAzimuth = false;
    for (const action of actions) {
      switch (action.type.id) {
        case ACTION.ACTION_AZIMUTH:
        case ACTION.ACTION_SLOPE:
        case ACTION.ACTION_WAIT:
          details.push({ ...action, status: { ...defaultStatus } });
          if (action.type.id === ACTION.ACTION_AZIMUTH) isAddZeroAzimuth = true;
          break;
        case ACTION.ACTION_SPARK:
          for (let i = 0; i < action.value1; i++) {
            details.push({
              ...action,
              id: `${action.id}_${i}`,
              value1: 1,
              value2: action.value2,
              value3: 0,
              status: { ...defaultStatus },
            });
            details.push({
              ...action,
              id: `${action.id}_w${i}`,
              type: { ...waitAction },
              value1: action.value3,
              value2: 0,
              value3: 0,
              status: { ...defaultStatus },
            });
          }
          details.pop();
          break;
      }
    }
    if (isAddZeroAzimuth) {
      const zeroAction = {
        id: "zero-azimuth",
        type: {
          id: 1,
          name: "установка азимута",
        },
        value1: 0,
        value2: 0,
        value3: 0,
      };
      details.push({ ...zeroAction, status: { ...defaultStatus } });
    }
    this.works.currentWork.work.details = [...details];
  }

  async calibrateAzimuth(time) {
    await this.device.calibrateAzimuth(time);
  }

  async calibrateSlope(time) {
    await this.device.calibrateSlope(time);
  }

  private async ballDrive(position: BallPosition) {
    const updateBallSetting = async (value: number) => {
      let setting: any = await this.settings.getById(
        SETTING.SETTING_BALL,
      );
      setting = setting.result;
      setting.value = value;
      await this.settings.update(SETTING.SETTING_BALL, setting);
    }

    const ball = await this.settings.getBall();
    const angle = await this.settings.getBallAngle();
    if (position === BallPosition.BALL_LEFT && ball == BallPosition.BALL_RIGHT) {
      await this.driver.rotateCCW(angle);
      await updateBallSetting(position);
    }
    if (position === BallPosition.BALL_RIGHT && ball == BallPosition.BALL_LEFT) {
      await this.driver.rotateCW(angle);
      await updateBallSetting(position);
    }
    
  }

  private async startLoop() {
    if (!this.works.currentWork) return;
    const details = this.works.currentWork.work.details;
    for (let i = 0; i < details.length; i++) {
      if (this.stopped) break;
      details[i].status = this.getStatus(STATUS.STATUS_RUN);
      await this.updateCurrentWork();
      switch (details[i].type.id) {
        case ACTION.ACTION_AZIMUTH:
          await this.device.setAzimuth(details[i].value1);
          break;
        case ACTION.ACTION_SLOPE:
          await this.device.setSlop(details[i].value1);
          break;
        case ACTION.ACTION_WAIT:
          await this.device.setWait(details[i].value1);
          break;
        case ACTION.ACTION_SPARK:
          await this.device.setSpark(details[i].value2);
          break;
      }
      details[i].status = this.getStatus(STATUS.STATUS_DONE);
      await this.updateCurrentWork();
    }
    await this.updateCurrentWork();
  }

  async stopAll(): Promise<any> {
    this.stopped = true;
    await this.device.stopAll();
    if (this.works.currentWork) {
      await this.updateStatus(this.works.currentWork.work, STATUS.STATUS_STOPPED);
      await this.removeCurrentWork();
    }
  }
}
