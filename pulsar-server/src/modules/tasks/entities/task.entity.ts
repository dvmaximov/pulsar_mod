import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ActionType } from "../../dictonary/entities/action-types.entity";

export interface TaskAction {
  id: number;
  type: ActionType;
  value1: number;
  value2: number;
  value3: number;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  actions: TaskAction[];
}

@Entity('tasks') 
export class TaskPack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 50, nullable: false})
  name: string;

  @Column({ name: 'description', length: 100, nullable: false, default: ""})
  description?: string;

  @Column({ name: 'actions' ,type: 'text', nullable: false, default: ""})
  actions?: string;

  static packToTask(taskPack: TaskPack): Task {
    const task: Task = {
      id: taskPack.id,
      name: taskPack.name,
      description: taskPack.description ?? "",
      actions: JSON.parse(taskPack.actions)
    };
    return task;
  }

  static taskToPack(task: Task): TaskPack {
    return {...task, actions: JSON.stringify(task.actions)}
  }
}
