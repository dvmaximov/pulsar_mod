import { Setting, SETTING } from "../settings.interface";
export const defaultSettings: Setting[] = [
  {
    id: SETTING.SETTING_AZIMUTH_SPEED,
    type: "number",
    name: "скорость вращения стола",
    value: 4.822,
  },
  {
    id: SETTING.SETTING_SLOPE_SPEED,
    type: "number",
    name: "скорость наклона стола",
    value: 3,
  },
  {
    id: SETTING.SETTING_CURRENT_AZIMUTH,
    type: "number",
    name: "текущий азимут стола",
    value: 0,
  },
  {
    id: SETTING.SETTING_CURRENT_SLOPE,
    type: "number",
    name: "текущий наклон стола",
    value: 0,
  },
  {
    id: SETTING.SETTING_VERSION,
    type: "number",
    name: "версия",
    value: 1.0,
  },
  {
    id: SETTING.SETTING_PORT,
    type: "string",
    name: "HTTP port",
    value: "80",
  },
  {
    id: SETTING.SETTING_SERVER,
    type: "string",
    name: "Общий сервер",
    value: "",
  },
];
