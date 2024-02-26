import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WORK } from "./entities/work-types.entity";
import { ACTION } from "./entities/action-types.entity";
import { STATUS } from "./entities/status-types.entity";
import { defaultActions } from "./data/actionTypes.data";
import { defaultWorks } from "./data/workTypes.data";
import { defaultStatus } from "./data/statusTypes.data";
import { ApiResult } from "../api/api.interface";
import { ActionType } from "./entities/action-types.entity";
import { StatusType } from "./entities/status-types.entity";
import { WorkType } from "./entities/work-types.entity";
import { CreateActionTypeDto } from "./dto/create-action-type.dto";
import { CreateStatusTypeDto } from "./dto/create-status-type.dto";
import { CreateWorkTypeDto } from "./dto/create-work-type.dto";

@Injectable()
export class DictonaryService {
 
  constructor(
    @InjectRepository(ActionType) private readonly actionRepository: Repository<ActionType>,
    @InjectRepository(StatusType) private readonly statusRepository: Repository<StatusType>,
    @InjectRepository(WorkType) private readonly workRepository: Repository<WorkType>,
  ) {
    this.actionRepository.find().then((actions) => {
      if (actions.length === 0) this.fillActionTypes();
    });
    this.statusRepository.find().then((statuses) => {
      if (statuses.length === 0) this.fillStatusTypes();
    });
    this.workRepository.find().then((works) => {
      if (works.length === 0) this.fillWorkTypes();
    });
  }

  private async createAction(createActionDto: CreateActionTypeDto): Promise<ActionType> {
    const action = this.actionRepository.create(createActionDto);
    return await this.actionRepository.save(action);  
  }  

  private async createStatus(createStatusDto: CreateStatusTypeDto): Promise<StatusType> {
    const status = this.statusRepository.create(createStatusDto);
    return await this.statusRepository.save(status);  
  }  

  private async createWork(createWorkDto: CreateWorkTypeDto): Promise<StatusType> {
    const work = this.workRepository.create(createWorkDto);
    return await this.workRepository.save(work);  
  }  

  async getAll(): Promise<ApiResult> {
    const actionTypesResult = [];
    let actionTypes = await this.actionRepository.find();
    for (const action of actionTypes) {
       actionTypesResult.push({
        id: action.id,
        name: action.name,
        value1: JSON.parse(action.value1),
        value2: JSON.parse(action.value2),
        value3: JSON.parse(action.value3),
       })
    }

    const statusTypesResult = [];
    let statusTypes = await this.statusRepository.find();
    for (const status of statusTypes) {
      statusTypesResult.push({
        id: status.id,
        name: status.name,
       })
    }

    const workTypesResult = [];
    let workTypes = await this.workRepository.find();
    for (const work of workTypes) {
      workTypesResult.push({
        id: work.id,
        name: work.name,
       })
    }

    const answer: ApiResult = {
      result: {
        actionTypes: actionTypesResult,
        workTypes: workTypesResult,
        statusTypes: statusTypesResult,
        WORK,
        STATUS,
        ACTION,
      },
      error: null,
    };
    return answer;
  }

  private async fillActionTypes() {
    for (const action of defaultActions) {
      const newAction = new CreateActionTypeDto();
      newAction.name = action.name;
      newAction.value1 = JSON.stringify(action.value1);
      newAction.value2 = JSON.stringify(action.value2);
      newAction.value3 = JSON.stringify(action.value3);
      await this.createAction(newAction);
    }
  }

  private async fillWorkTypes() {
    for (const work of defaultWorks) {
      const newWork = new CreateWorkTypeDto();
      newWork.name = work.name;
      await this.createWork(newWork);
    }
  }

  private async fillStatusTypes() {
    for (const status of defaultStatus) {
      const newStatus = new CreateStatusTypeDto();
      newStatus.name = status.name;
      await this.createStatus(newStatus);
    }
  }
}
