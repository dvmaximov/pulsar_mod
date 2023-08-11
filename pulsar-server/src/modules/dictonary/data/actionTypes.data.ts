import { ACTION } from "../types/actionType.interface";

export const defaultActions = [
  {
    id: ACTION.ACTION_AZIMUTH,
    name: "установка азимута",
    value1: {
      label: "азимут (град)",
      max: 360,
      min: 0,
      step: 0.1,
    },
    value2: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
    value3: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
  },
  {
    id: ACTION.ACTION_SLOPE,
    name: "установка наклона",
    value1: {
      label: "наклон (град)",
      max: 10,
      min: 0,
      step: 1,
    },
    value2: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
    value3: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
  },
  {
    id: ACTION.ACTION_WAIT,
    name: "ожидание",
    value1: {
      label: "время (сек)",
      max: 10000,
      min: 0,
      step: 1,
    },
    value2: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
    value3: {
      label: "",
      max: 0,
      min: 0,
      step: 1,
    },
  },
  {
    id: ACTION.ACTION_SPARK,
    name: "разряд",
    value1: {
      label: "количество",
      max: 1000,
      min: 1,
      step: 1,
    },
    value2: {
      label: "время (сек)",
      max: 10000,
      min: 0,
      step: 0.1,
    },

    value3: {
      label: "интервал (сек)",
      max: 1000,
      min: 0,
      step: 0.1,
    },
  },
];
