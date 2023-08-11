export const SETTING = {
  SETTING_AZIMUTH_SPEED: 1,
  SETTING_SLOPE_SPEED: 2,
  SETTING_CURRENT_AZIMUTH: 3,
  SETTING_CURRENT_SLOPE: 4,
  SETTING_VERSION: 5,
  SETTING_PORT: 6,
  SETTING_PASS: 7,
};

export interface Setting {
  id: number;
  name: string;
  value: any;
}
