import { ActionType } from "../dictonary/entities/action-types.entity";

export interface TaskAction {
  id: number;
  type: ActionType;
  value1: number;
  value2: number;
  value3: number;
}
