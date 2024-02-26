import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const ACTION = {
  ACTION_AZIMUTH: 1,
  ACTION_SLOPE: 2,
  ACTION_WAIT: 3,
  ACTION_SPARK: 4,
};

export interface ActionValue {
  label: string;
  max: number;
  min: number;
  step: number;
}

@Entity('actionTypes') 
export class ActionType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ name: 'value1', type: 'text', nullable: false, default: ""})
  value1: string;

  @Column({ name: 'value2', type: 'text', nullable: false, default: ""})
  value2: string;

  @Column({ name: 'value3', type: 'text', nullable: false, default: ""})
  value3: string;
}
