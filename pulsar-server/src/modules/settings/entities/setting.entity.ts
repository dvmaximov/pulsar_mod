import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const SETTING = {
  SETTING_AZIMUTH_SPEED: 1,
  SETTING_SLOPE_SPEED: 2,
  SETTING_CURRENT_AZIMUTH: 3,
  SETTING_CURRENT_SLOPE: 4,
  SETTING_VERSION: 5,
  SETTING_PORT: 6,
  SETTING_SERVER: 7,
  SETTING_STATION: 8,
};

@Entity('settings') 
export class Setting {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ name: 'type', type: 'text', nullable: false, default: "number"})
  type: string;

  @Column({ name: 'value', length: 50, nullable: false, default: ""})
  value: string;
}
