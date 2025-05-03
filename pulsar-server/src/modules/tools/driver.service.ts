//28BYJ-48 5В с драйвером на ULN2003
import { Injectable } from "@nestjs/common";
import { Gpio } from "./gpio.service";
import * as cp from "child_process";

const exec = cp.exec;

const delay = async (ms: number): Promise<any> => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
}

// const FULL_ROTATION_STEPS = 4076; //чтобы помнить
// const STEPS_OF_DEGREE = 11.32;
// const MAX_STEPS_COUNT = 8;

const FULL_ROTATION_STEPS = 2038; //чтобы помнить
const STEPS_OF_DEGREE = 5.66;
const MAX_STEPS_COUNT = 4;

const initPins = [15, 18, 16, 22]; // int1, int3, int2, int4

class Position {
  private current = -1;
  constructor (private readonly stepCount: number) {}

  increase(): number {
    this.current++;
    this.current = this.current % this.stepCount;
    return this.current;
  }

  decrease(): number {
    this.current = this.current <= 0 ? this.stepCount - 1 : this.current - 1;
    this.current = this.current % this.stepCount;
    return this.current;
  }

  clear() {
    this.current = -1;
  }
}

@Injectable()
export class DriverService {
  private position = new Position(MAX_STEPS_COUNT);
  private isRunning = false;
  private pins: Gpio[] = [];
        // private steps = [
        //      [ 1, 0, 0, 0 ],
        //      [ 1, 1, 0, 0 ],
        //      [ 0, 1, 0, 0 ],
        //      [ 0, 1, 1, 0 ],
        //      [ 0, 0, 1, 0 ],
        //      [ 0, 0, 1, 1 ],
        //      [ 0, 0, 0, 1 ],
        //      [ 1, 0, 0, 1 ],
        // ];

        private steps = [
                [ 1, 0, 1, 0 ],
                [ 0, 1, 1, 0 ],
                [ 0, 1, 0, 1 ],
                [ 1, 0, 0, 1 ],
        ];

  constructor() {
    for (const [idx, inPin] of initPins.entries()) {
      this.pins[idx] = new Gpio({ pin: inPin, up: false });
    }
  }

  private writePin(pin: Gpio, value: number) {
    if (pin) pin.write(value);
  }

  private calculateSteps(degree: number) {
    return Math.round(STEPS_OF_DEGREE * Math.abs(degree));
  }

  private step(combination: number){
    // console.log(this.steps[combination])
    let command = '';
    for (const [idx, value] of this.steps[combination].entries()){
      command += `gpio -1 write ${this.pins[idx].pin} ${value};`
      // this.writePin(this.pins[idx], value);
    }
    Gpio.runCommandSync(command);

  }

  async stop(){
    // this.pins.forEach((gpio) => this.writePin(gpio, 0));
    let command = '';
    for (const pin of this.pins){
      command += `gpio -1 write ${pin.pin} 0;`
      // this.writePin(this.pins[idx], value);
    }
    Gpio.runCommandSync(command);
    this.isRunning = false;
    this.position.clear();
  }
  
  async test (degree: number) {
    // console.log('cw')
    await this.rotateCW(degree);
    await delay(1000);
    // console.log('ccw')
    await this.rotateCCW(degree);
  }

  async rotateCW(degree: number){
    await this.stop();
    if (this.isRunning) return;
    this.isRunning = true;
    const steps = this.calculateSteps(degree);
    if (steps === 0 || isNaN(steps)) return;
    console.log(steps);
    for (let i of Array(steps).keys()) {
      this.step(this.position.increase())
    }
    await this.stop();
    this.isRunning = false; 
  }

  async rotateCCW(degree: number){
    await this.stop();
    if (this.isRunning) return;
    this.isRunning = true;    
    const steps = this.calculateSteps(degree);
    if (steps === 0 || isNaN(steps)) return;    
    console.log(steps);
    for (let i of Array(steps).keys()) {
      this.step(this.position.decrease())
    }
    await this.stop();
    this.isRunning = false; 
  }

}

