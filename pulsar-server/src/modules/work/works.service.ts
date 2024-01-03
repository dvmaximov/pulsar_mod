import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { Work } from "./work.interface";
import { ApiResult } from "../api/api.interface";
import { STATUS } from "../dictonary/types/statusType.interface";
import { on, emit } from "src/modules/api/socket-client.service";

const MAX_WORKS = 10;

@Injectable()
export class WorksService {
  constructor(private api: ApiService) {}

  public createEvents() {
    on("getStationWorks", async (data) => {
      const answer = await this.getAll();
      emit("stationWorks", { ...data, works: answer.result });
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
    const answer: ApiResult = await this.api.getAll("works");
    try {
      answer.result = await this.clearWorks(answer.result);
    } catch (e) {
      answer.result = null;
      answer.error = e;
    }

    return answer;
  }

  async getCurrentWork(): Promise<ApiResult> {
    return await this.api.getAll("currentWork");
  }

  async create(work: Work): Promise<ApiResult> {
    return await this.api.create("works", work);
  }

  async update(id: number, work: Work): Promise<ApiResult> {
    return await this.api.update("works", id, work);
  }

  async delete(id: any): Promise<ApiResult> {
    return await this.api.delete("works", id);
  }
}
