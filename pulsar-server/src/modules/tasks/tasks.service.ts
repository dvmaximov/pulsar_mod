import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { Task } from "./task.interface";
import { ApiResult } from "../api/api.interface";
import { on, emit } from "src/modules/api/socket-client.service";

@Injectable()
export class TasksService {
  constructor(private api: ApiService) {}

  public createEvents() {
    on("getStationTasks", async (data) => {
      const answer = await this.getAll();
      emit("stationTasks", { ...data, message: answer.result });
    });
  }

  async getAll(): Promise<ApiResult> {
    return await this.api.getAll("tasks");
  }

  async getById(id: number): Promise<ApiResult> {
    return await this.api.getById("tasks", id);
  }

  async create(task: Task): Promise<ApiResult> {
    return await this.api.create("tasks", task);
  }

  async update(id: number, task: Task): Promise<ApiResult> {
    return await this.api.update("tasks", id, task);
  }

  async delete(id: any): Promise<ApiResult> {
    return await this.api.delete("tasks", id);
  }
}
