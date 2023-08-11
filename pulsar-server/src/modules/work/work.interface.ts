import { StatusType } from "../dictonary/types/statusType.interface";
import { WorkType } from "../dictonary/types/workType.interface";

export interface Work {
  id: number;
  type: WorkType;
  status: StatusType;
  item: any;
  startTime: number;
  details: any[];
}
