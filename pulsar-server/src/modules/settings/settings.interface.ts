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

export interface Setting {
  id?: number;
  name: string;
  type: string;
  value: any;
}
