import { Injectable } from "@nestjs/common";

import { ApiService } from "../api/api.service";
import { WORK } from "./types/workType.interface";
import { ACTION } from "./types/actionType.interface";
import { STATUS } from "./types/statusType.interface";
import { defaultActions } from "./data/actionTypes.data";
import { defaultWorks } from "./data/workTypes.data";
import { defaultStatus } from "./data/statusTypes.data";
import { ApiResult } from "../api/api.interface";

@Injectable()
export class DictonaryService {
  constructor(private api: ApiService) {}

  async getAll(): Promise<ApiResult> {
    let actionTypes = await this.api.getAll("actionTypes");
    if (actionTypes.result && Array.isArray(actionTypes.result)) {
      if (actionTypes.result.length === 0) {
        await this.fillActionTypes();
        actionTypes = await this.api.getAll("actionTypes");
      }
    }

    let workTypes = await this.api.getAll("workTypes");
    if (workTypes.result && Array.isArray(workTypes.result)) {
      if (workTypes.result.length === 0) {
        await this.fillWorkTypes();
        workTypes = await this.api.getAll("workTypes");
      }
    }

    let statusTypes = await this.api.getAll("statusTypes");
    if (statusTypes.result && Array.isArray(statusTypes.result)) {
      if (statusTypes.result.length === 0) {
        await this.fillStatusTypes();
        statusTypes = await this.api.getAll("statusTypes");
      }
    }

    const answer: ApiResult = {
      result: {
        actionTypes: actionTypes.result,
        workTypes: workTypes.result,
        statusTypes: statusTypes.result,
        WORK,
        STATUS,
        ACTION,
      },
      error: null,
    };

    return answer;
  }

  private async fillActionTypes(): Promise<any> {
    for (const action of defaultActions) {
      await this.api.create("actionTypes", action);
    }
    return null;
  }

  private async fillWorkTypes(): Promise<any> {
    for (const work of defaultWorks) {
      await this.api.create("workTypes", work);
    }
    return null;
  }

  private async fillStatusTypes(): Promise<any> {
    for (const status of defaultStatus) {
      await this.api.create("statusTypes", status);
    }
    return null;
  }
}
