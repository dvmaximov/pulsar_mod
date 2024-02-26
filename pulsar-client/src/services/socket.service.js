import { io } from "socket.io-client";
import { works, settings } from "../store";

const socket = io(`ws://${location.hostname}`);

socket.on("connect", () => {
  console.log("socket ", socket.connected); // true
});

socket.on("workStatusUpdate", (e) => {
  works.fetch();
  works.fetchCurrentWork(e);
});

socket.on("serverTime", (e) => {
  settings.setServerTime(+e);
});

socket.on("settingsUpdate", (e) => {
  settings.fetch();
});
