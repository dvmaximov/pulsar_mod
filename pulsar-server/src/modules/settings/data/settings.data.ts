import { Setting, SETTING } from "../settings.interface";
export const defaultSettings: Setting[] = [
  {
    id: SETTING.SETTING_AZIMUTH_SPEED,
    name: "скорость вращения стола",
    value: 4.822,
  },
  {
    id: SETTING.SETTING_SLOPE_SPEED,
    name: "скорость наклона стола",
    value: 3,
  },
  {
    id: SETTING.SETTING_CURRENT_AZIMUTH,
    name: "текущий азимут стола",
    value: 0,
  },
  {
    id: SETTING.SETTING_CURRENT_SLOPE,
    name: "текущий наклон стола",
    value: 0,
  },
  {
    id: SETTING.SETTING_VERSION,
    name: "версия",
    value: 1.0,
  },
  {
    id: SETTING.SETTING_PORT,
    name: "HTTP port",
    value: 80,
  },
  {
    id: SETTING.SETTING_PASS,
    name: "пароль",
    value: "",
  },
];
