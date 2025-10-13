//28BYJ-48 5В с драйвером на ULN2003
import { Injectable } from "@nestjs/common";
import { Gpio } from "./gpio.service";

const delay = async (ms: number): Promise<any> => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
}

//2048  4096
//2038  4076

const FULL_ROTATION_STEPS = 2038; // чтобы помнить - полный оборот (или 2048)
const defaultPins = [15, 18, 16, 22]; // int1, int3, int2, int4


@Injectable()
export class DriverService {
  private pins: Gpio[] = [];
  private stepNumber = 4;

  private direction = 0; // 0 - против часовой, 1 - по часовой
 
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
    setTimeout(() => {
      this.pins[0] = new Gpio({ pin: defaultPins[0], up: false });
      this.pins[1] = new Gpio({ pin: defaultPins[1], up: false });
      this.pins[2] = new Gpio({ pin: defaultPins[2], up: false });
      this.pins[3] = new Gpio({ pin: defaultPins[3], up: false });
    },3000)

  }

  private writePin(pin: Gpio, value: number) {
    if (pin) pin.write(value);
  }

  async rotateCW(angle: number) {
    await this.stop();
    await this.rotate(angle);
  }

  async rotateCCW(angle: number) {
    await this.stop();
    await this.rotate(-angle);
  }

  async stop(){
    this.pins.forEach(async (gpio) => this.writePin(gpio, 0));
  }

  // async test (stepsToMove: number) {
  //   await this.step(500);
  //   await delay(1000);
  //   await this.step(-500);
  // }
  
  private async rotate(stepsToMove: number, isLog = false){
    let steps_left: number = Math.abs(stepsToMove);
    let count = 0;

    if (stepsToMove > 0) { this.direction = 1; }
    if (stepsToMove < 0) { this.direction = 0; count = steps_left}
    while (steps_left > 0)
    {
        if (this.direction == 1) { count++; }
        else { count--; }
        steps_left--;
        this.stepMotor(count % this.stepNumber);
        await delay(10);
    }
    this.stop();
  } 

 private stepMotor(step: number) {

    let command = '';

    for (let i = 0; i < this.stepNumber; i++)
    {
      command += `gpio -1 write ${this.pins[i].pin} ${this.steps[step][i]}; `
      // this.writePin(this.pins[i], this.steps[step][i]);
    }
    // console.log(command)
    Gpio.runCommandSync(command);

 }
}
