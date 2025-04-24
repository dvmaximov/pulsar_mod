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
  private current = 0;
 
  constructor (private readonly stepCount: number) {}

  increase(): number {
    const result = this.current % this.stepCount;
    this.current++;
    return result;
  }

  // [ 1, 0, 1, 0 ],
  // [ 0, 1, 1, 0 ],
  // [ 0, 1, 0, 1 ],
  // [ 1, 0, 0, 1 ],

  decrease(): number {
    const result = this.stepCount - 1 - this.current % this.stepCount;
    this.current++;
    return result;
  }

  clear() {
    this.current = 0;
  }
}

@Injectable()
export class DriverService {
  private position = new Position(MAX_STEPS_COUNT);
  private isRunning = false;
  private pins: Gpio[] = [];
	// private steps = [
	// 	[ 1, 0, 0, 0 ],
	// 	[ 1, 1, 0, 0 ],
	// 	[ 0, 1, 0, 0 ],
	// 	[ 0, 1, 1, 0 ],
	// 	[ 0, 0, 1, 0 ],
	// 	[ 0, 0, 1, 1 ],
	// 	[ 0, 0, 0, 1 ],
	// 	[ 1, 0, 0, 1 ],
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
    // this.pins[0] = new Gpio({ pin: in1, up: false });
    // this.pins[1] = new Gpio({ pin: in2, up: false });
    // this.pins[2] = new Gpio({ pin: in3, up: false });
    // this.pins[3] = new Gpio({ pin: in4, up: false });
  }

  private writePin(pin: Gpio, value: number) {
    if (pin) pin.write(value);
  }

  private calculateSteps(degree: number) {
    return Math.round(STEPS_OF_DEGREE * Math.abs(degree));
  }
  
  // private step(combination: number){
  //   console.log(this.steps[combination])
  //   let command = '';
  //   console.log(Gpio.arrayPinsToCommand(initPins, this.steps[combination]));
  //   Gpio.runCommandSync(Gpio.arrayPinsToCommand(initPins, this.steps[combination]));
  // } 

  async stop(){
    this.pins.forEach(async (gpio) => this.writePin(gpio, 0));
    this.position.clear();
  }

  async rotateCW(degree: number){
    if (this.isRunning) return;
    this.isRunning = true;
    const steps = this.calculateSteps(degree);
    if (steps === 0 || isNaN(steps)) return;
    let command = '';
    for (let i of Array(steps).keys()) {
      command += Gpio.arrayPinsToCommand(initPins, this.steps[this.position.increase()]);      
    }

    Gpio.runCommandSync(command);
    this.stop();
    this.isRunning = false;
}

  async rotateCCW(degree: number){
    if (this.isRunning) return;
    this.isRunning = true;    
    const steps = this.calculateSteps(degree);
    if (steps === 0 || isNaN(steps)) return;
    let command = '';
    for (let i of Array(steps).keys()) {
      command += Gpio.arrayPinsToCommand(initPins, this.steps[this.position.decrease()]); 
    }
    this.stop();
    this.isRunning = false; 
  }

}
