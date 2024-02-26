import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const WORK = {
  WORK_PROGRAMM: 1,
};


@Entity('workTypes') 
export class WorkType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 50, nullable: false, unique: true })
  name: string;
}
