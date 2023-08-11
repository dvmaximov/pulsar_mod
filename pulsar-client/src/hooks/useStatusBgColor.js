import { useMemo } from "react";
import { dictonary } from "../store";

export const useStatusBgColor = (status, initValue = "#f1f1f1") => {
  const color = useMemo(() => {
    switch (status.id) {
      case dictonary.STATUS.STATUS_RUN:
        return "#ffffe6";
      case dictonary.STATUS.STATUS_DONE:
        return "#e8ffe6";
      case dictonary.STATUS.STATUS_EXPIRED:
      case dictonary.STATUS.STATUS_STOPPED:
        return "#ffe6e7";
      default:
        return initValue;
    }
  }, [status]);

  return color;
};
