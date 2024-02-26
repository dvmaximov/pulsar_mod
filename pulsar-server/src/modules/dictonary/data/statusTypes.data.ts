import { STATUS } from "../entities/status-types.entity";
export const defaultStatus = [
  {
    id: STATUS.STATUS_WAIT,
    name: "ожидание",
  },
  {
    id: STATUS.STATUS_RUN,
    name: "выполнение",
  },
  {
    id: STATUS.STATUS_DONE,
    name: "завершено",
  },
  {
    id: STATUS.STATUS_EXPIRED,
    name: "просрочено",
  },
  {
    id: STATUS.STATUS_STOPPED,
    name: "остановлено",
  },
];
