/**
 * Код взят из источника orange-pi-gpio https://github.com/BorisKotlyarov/orange-pi-gpio
 * Причины:
 * - предупреждения необработанного отказа промиса при создании объекта Gpio
 *   во время разработки при неустановленной библиотеки WiringOP
 * - необходимость добавить ключ -1 к команде gpio для обращения по физическому
 *   номеру пина
 * - необходимость выставить логическую 1 перед уставленовкой режима пина из-за
 *   применения реле с нормально-замкнутым ключом
 */
import * as cp from "child_process";

const exec = cp.exec;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = () => {};

export class Gpio {
  pin = 5;
  mode = "out";
  up = true;

  constructor({ pin = 5, mode = "out", up = true, ready = emptyFn }) {
    this.pin = pin;
    this.mode = mode;
    this.up = up;

    this.init()
      .then(() => {
        ready();
      })
      .catch(() => {
        console.log(`error init ${pin} pin`);
      });
  }

  init() {
    if (this.up) this.cmd(`gpio -1 write ${this.pin} 1`).catch(emptyFn);
    return this.cmd(`gpio -1 mode ${this.pin} ${this.mode}`).catch(emptyFn);
  }

  read() {
    return this.cmd(`gpio -1 read ${this.pin}`)
      .then((state: string) => {
        return state.replace(/[^\d]/gm, "");
      })
      .catch(emptyFn);
  }

  write(value) {
    return this.cmd(`gpio -1 write ${this.pin} ${value}`).catch(emptyFn);
  }

  cmd(command) {
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
