import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const STATUS = {
  STATUS_WAIT: 1,
  STATUS_RUN: 2,
  STATUS_DONE: 3,
  STATUS_EXPIRED: 4,
  STATUS_STOPPED: 5,
};

@Entity('statusTypes') 
export class StatusType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 50, nullable: false, unique: true })
  name: string;
}
