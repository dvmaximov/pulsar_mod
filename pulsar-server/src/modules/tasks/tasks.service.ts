import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskPack } from "./entities/task.entity";
import { ApiResult, initResult } from "../api/api.interface";
import { on, emit } from "src/modules/api/socket-client.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskPack) private readonly tasksRepository: Repository<TaskPack>,
  ) {}

  public createEvents() {
    on("getStationTasks", async (data) => {
      const answer = await this.getAll();
      emit("stationTasks", { ...data, message: answer.result });
    });
    on("deleteStationTask", async (data) => {
      const answer = await this.delete(data.message.id);
      emit("stationTaskDeleted", { ...data, message: answer.result });
    });
    on("updateStationTask", async (data) => {
      const id = data.message.task.id;
      const task = data.message.task;
      const answer = await this.update(id, task);
      emit("stationTaskUpdated", { ...data, message: answer.result });
    });
    on("moveStationTask", async (data) => {
      const task = data.message.task;
      const answer = await this.create(task);
      emit("stationTaskMoved", { ...data, message: answer.result });
    });
  }

  async create(task: Task): Promise<ApiResult> {
    const newTaskPack = TaskPack.taskToPack(task);
    const answer = {...initResult};
    let taskPack = this.tasksRepository.create(newTaskPack);
    taskPack = await this.tasksRepository.save(taskPack);
    answer.result = taskPack;
    return answer;
  }

  async getAll(): Promise<ApiResult> {
    const taskPacks = await this.tasksRepository.find();
    const tasks: Task[] = [];
    for (const taskPack of taskPacks) {
      tasks.push(TaskPack.packToTask(taskPack))
    }
    return { ...initResult, result: tasks };
  }

  async getById(id: number): Promise<ApiResult> {
    const taskPack = await this.tasksRepository.findOne({where: {id: id}});
    return { ...initResult, result: TaskPack.packToTask(taskPack) };
  }

  async update(id: number, task: Task): Promise<ApiResult> {
    const taskPack = await this.tasksRepository.findOne({ where: { id: id } });
    Object.assign(taskPack, TaskPack.taskToPack(task));
    const updated =  await this.tasksRepository.save(taskPack);
    if (!updated) {
      return { ...initResult, error: 'Ошибка сохранения программы.'};
    }
    return { ...initResult, result: updated };
  }

  async delete(id: any): Promise<ApiResult> {
    const answer = {...initResult}
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      answer.error = `Действие "${id}" не найдено`;
    }
    return {...answer, result: "Программа удалена"};
  }
}
