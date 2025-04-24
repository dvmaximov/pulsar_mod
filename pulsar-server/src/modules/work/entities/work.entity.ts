import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { WorkType } from "../../dictonary/entities/work-types.entity";
import { StatusType } from "../../dictonary/entities/status-types.entity";

export interface Work {
  id: number;
  type: WorkType;
  status: StatusType;
  ball: number;
  item: any;
  startTime: number;
  details: any[];
}


@Entity('works') 
export class WorkPack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'type', type: 'text', nullable: false})
  type: string;

  @Column({ name: 'status', type: 'text', nullable: false})
  status: string;

  @Column({ name: 'ball', nullable: false, default: 0})
  ball: number;
  
  @Column({ name: 'item' , type: 'text', nullable: false})
  item: string;
  
  @Column({ name: 'startTime', nullable: true})
  startTime: number;
  
  @Column({ name: 'details' , type: 'text', nullable: false})
  details: string;
  
  static packToWork(workPack: WorkPack): Work {
    const work: Work = {
      id: workPack.id,
      ball: workPack.ball,
      type: JSON.parse(workPack.type),
      status: JSON.parse(workPack.status),
      item: JSON.parse(workPack.item),
      startTime: workPack.startTime,
      details: JSON.parse(workPack.details)
    };
    return work;
  }

  static workToPack(work: Work): WorkPack {
    return {
      ...work, 
      type: JSON.stringify(work.type),
      status: JSON.stringify(work.status),
      item: JSON.stringify(work.item),
      details: JSON.stringify(work.details),
    }
  }
}
