import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { Task } from "./task.interface";
import { ApiResult } from "../api/api.interface";

@Injectable()
export class TasksService {
  constructor(private api: ApiService) {}

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
