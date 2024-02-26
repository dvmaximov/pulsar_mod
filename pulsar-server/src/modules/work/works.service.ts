import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResult, initResult } from "../api/api.interface";
import { STATUS } from "../dictonary/entities/status-types.entity";
import { on, emit } from "src/modules/api/socket-client.service";
import { Work, WorkPack } from "./entities/work.entity";


const MAX_WORKS = 10;

@Injectable()
export class WorksService {
  currentWork = null;

  constructor(
    @InjectRepository(WorkPack) private readonly worksRepository: Repository<WorkPack>,
    ) {}

  public createEvents() {
    on("getStationWorks", async (data) => {
      const answer = await this.getAll();
      emit("stationWorks", { ...data, message: answer.result });
    });
  }

  private async clearWorks(works): Promise<Array<Work>> {
    let doneWorks = works.filter(
      (item) =>
        item.status.id === STATUS.STATUS_DONE ||
        item.status.id === STATUS.STATUS_EXPIRED ||
        item.status.id === STATUS.STATUS_STOPPED,
    );
    const waitWorks = works.filter(
      (item) =>
        item.status.id === STATUS.STATUS_WAIT ||
        item.status.id === STATUS.STATUS_RUN,
    );
    const different = doneWorks.length - MAX_WORKS;
    if (different > 0) {
      for (let i = 0; i < different; i++) {
        await this.delete(doneWorks[i].id);
      }
      doneWorks = doneWorks.slice(different);
    }
    return [...doneWorks, ...waitWorks];
  }

  async getAll(): Promise<ApiResult> {
    const workPacks = await this.worksRepository.find();
    const works: Work[] = [];
    for (const workPack of workPacks) {
      works.push(WorkPack.packToWork(workPack))
    }
    return { ...initResult, result: works };    
  }

  async getCurrentWork(): Promise<ApiResult> {
    return {...initResult, result: this.currentWork};
  }

  async create(work: Work): Promise<ApiResult> {
    const newWorkPack = WorkPack.workToPack(work);
    const answer = {...initResult};
    let workPack = this.worksRepository.create(newWorkPack);
    workPack = await this.worksRepository.save(workPack);
    answer.result = {...work, id: workPack.id};
    return answer;    
  }

  async update(id: number, work: Work): Promise<ApiResult> {
    const workPack = await this.worksRepository.findOne({ where: { id: id } });
    Object.assign(workPack, WorkPack.workToPack(work));
    const updated =  await this.worksRepository.save(workPack);
    if (!updated) {
      return { ...initResult, error: 'Ошибка сохранения задачи.'};
    }
    return { ...initResult, result: updated };
  }

  async delete(id: number): Promise<ApiResult> {
    const answer = {...initResult}
    const result = await this.worksRepository.delete(id);
    if (result.affected === 0) {
      answer.error = `Действие "${id}" не найдено`;
    }
    return {...answer, result: "Задача удалена"};
  }
}
