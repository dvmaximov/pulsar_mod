import { ActionType } from "../dictonary/types/actionType.interface";

export interface TaskAction {
  id: number;
  type: ActionType;
  value1: number;
  value2: number;
  value3: number;
}
