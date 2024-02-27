import { SETTING } from "../entities/setting.entity";
export const defaultSettings = [
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
    name: "HTTP port сервера",
    value: "",
  },
  {
    id: SETTING.SETTING_SERVER,
    type: "string",
    name: "Общий сервер",
    value: "ws://pulsar.centrett.ru",
  },
  {
    id: SETTING.SETTING_STATION,
    type: "string",
    name: "Имя станции",
    value: "тестовая станция",
  },
];
