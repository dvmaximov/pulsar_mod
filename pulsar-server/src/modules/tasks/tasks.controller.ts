import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from "@nestjs/common";

import { Task } from "./entities/task.entity";
import { TasksService } from "./tasks.service";
import { ApiResult } from "../api/api.interface";

@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async index(): Promise<ApiResult> {
    return await this.tasksService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id): Promise<ApiResult> {
    return await this.tasksService.getById(id);
  }

  @Post()
  async create(@Body() task: any): Promise<ApiResult> {
    return await this.tasksService.create(task);
  }

  @Put(":id")
  async update(@Param("id") id, @Body() task: Task): Promise<ApiResult> {
    return this.tasksService.update(id, task);
  }

  @Delete(":id")
  async delete(@Param("id") id): Promise<ApiResult> {
    return await this.tasksService.delete(id);
  }
}
