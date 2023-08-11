import { TaskAction } from "./taskAction.interface";

interface Task {
  id: number;
  name: string;
  description: string;
  actions: TaskAction[];
}

export { Task };
