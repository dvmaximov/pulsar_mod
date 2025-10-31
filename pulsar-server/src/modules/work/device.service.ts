import { Injectable } from "@nestjs/common";
import { SettingsService } from "../settings/settings.service";
import { Gpio } from "../tools/gpio.service";
import { SETTING } from "../settings/entities/setting.entity";
import { SocketService } from "../api/socket.service";

const PIN = {
  PIN_LEFT: 7,
  PIN_RIGHT: 11,
  PIN_UP: 5,
  PIN_DOWN: 3,
  PIN_SPARK: 24, //13,
};

const DEVICE = {
  DEVICE_ON: 0,
  DEVICE_OFF: 1,
  DEVICE_SPARK_ON: 1,
  DEVICE_SPARK_OFF: 0,
};

@Injectable()
export class DeviceService {
  private driveLeft = null;
  private driveRight = null;
  private driveUp = null;
  private driveDown = null;
  private spark = null;

  constructor(
    private readonly settings: SettingsService,
    private readonly socket: SocketService,
  ) {
    this.driveLeft = new Gpio({ pin: PIN.PIN_LEFT });
    this.driveRight = new Gpio({ pin: PIN.PIN_RIGHT });
    this.driveUp = new Gpio({ pin: PIN.PIN_UP });
    this.driveDown = new Gpio({ pin: PIN.PIN_DOWN });
    this.spark = new Gpio({ pin: PIN.PIN_SPARK, up: false });
  }

  private async delay(ms): Promise<any> {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve();
      }, ms);
    });
  }

  private async writePin(pin, value): Promise<any> {
    try {
      switch (pin) {
        case PIN.PIN_LEFT:
          if (this.driveLeft) await this.driveLeft.write(value);
          break;
        case PIN.PIN_RIGHT:
          if (this.driveRight) await this.driveRight.write(value);
          break;
        case PIN.PIN_UP:
          if (this.driveUp) await this.driveUp.write(value);
          break;
        case PIN.PIN_DOWN:
          if (this.driveDown) await this.driveDown.write(value);
          break;
        case PIN.PIN_SPARK:
          if (this.spark) await this.spark.write(value);
          break;
      }
    } catch {}
  }

  async stopAll(): Promise<any> {
    try {
      this.writePin(PIN.PIN_LEFT, DEVICE.DEVICE_OFF);
      this.writePin(PIN.PIN_RIGHT, DEVICE.DEVICE_OFF);
      this.writePin(PIN.PIN_UP, DEVICE.DEVICE_OFF);
      this.writePin(PIN.PIN_DOWN, DEVICE.DEVICE_OFF);
      this.writePin(PIN.PIN_SPARK, DEVICE.DEVICE_SPARK_OFF);
    } catch {}
  }

  private async calculeteAngle(azimuth): Promise<any> {
    const zeroAzimuthTime = 5;
    let speed: any = await this.settings.getById(SETTING.SETTING_AZIMUTH_SPEED);
    speed = +speed.result.value;
    if (speed === 0) return 0;

    let currentAngle: any = await this.settings.getById(
      SETTING.SETTING_CURRENT_AZIMUTH,
    );
    currentAngle = +currentAngle.result.value;
    const different = azimuth - currentAngle;
    let time = different / speed;
    /**
     * При установке 0 по азимуту добавить 1 секутду для гарантии достижения стопора
     * (time отрицательный)
     */
    if (different !== 0 && azimuth === 0) time -= zeroAzimuthTime;

    return time;
  }

  private async calculeteSlope(slope): Promise<any> {
    let speed: any = await this.settings.getById(SETTING.SETTING_SLOPE_SPEED);
    speed = +speed.result.value;
    let currentSlope: any = await this.settings.getById(
      SETTING.SETTING_CURRENT_SLOPE,
    );
    currentSlope = +currentSlope.result.value;
    const different = slope - currentSlope;
    return different / speed;
  }

  async calibrateAzimuth(time) {
    this.writePin(PIN.PIN_RIGHT, DEVICE.DEVICE_ON);
    await this.delay(time * 1000);
    this.writePin(PIN.PIN_RIGHT, DEVICE.DEVICE_OFF);
  }

  async calibrateSlope(time) {
    this.writePin(PIN.PIN_DOWN, DEVICE.DEVICE_ON);
    await this.delay(time * 1000);
    this.writePin(PIN.PIN_DOWN, DEVICE.DEVICE_OFF);
  }

  async setAzimuth(value): Promise<any> {
    try {
      let time = await this.calculeteAngle(value);

      if (time === 0) return;
      const direction = time < 0 ? PIN.PIN_LEFT : PIN.PIN_RIGHT;
      time = Math.abs(time * 1000);

      await this.writePin(direction, DEVICE.DEVICE_ON);
      await this.delay(time);
      await this.writePin(direction, DEVICE.DEVICE_OFF);

      let azimuth: any = await this.settings.getById(
        SETTING.SETTING_CURRENT_AZIMUTH,
      );
      azimuth = azimuth.result;
      azimuth.value = value;
      await this.settings.update(SETTING.SETTING_CURRENT_AZIMUTH, azimuth);
      await this.socket.settingsUpdate();
    } catch (e) {
      console.log("azimuth error");
    }
  }

  async setSlop(value): Promise<any> {
    let time = await this.calculeteSlope(value);
    const direction = time < 0 ? PIN.PIN_UP : PIN.PIN_DOWN;
    time = Math.abs(time * 1000);

    if (time === 0) return;
    this.writePin(direction, DEVICE.DEVICE_ON);
    await this.delay(time);
    this.writePin(direction, DEVICE.DEVICE_OFF);

    let slope: any = await this.settings.getById(SETTING.SETTING_CURRENT_SLOPE);
    slope = slope.result;
    slope.value = value;
    this.settings.update(SETTING.SETTING_CURRENT_SLOPE, slope);
    await this.socket.settingsUpdate();
  }

  async setWait(value): Promise<any> {
    await this.delay((+value) * 1000);
  }

  async setSpark(value): Promise<any> {
    this.writePin(PIN.PIN_SPARK, DEVICE.DEVICE_SPARK_ON);
    await this.delay(value * 1000);
    this.writePin(PIN.PIN_SPARK, DEVICE.DEVICE_SPARK_OFF);
  }
}
