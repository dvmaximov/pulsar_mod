import { io } from "socket.io-client";

let socket = null;
const callbacks = [];
let isFirstConnect = true;
let socketConnected = false;
let station;

export const addOnCallback = (event, cb) => {
  if (callbacks.find((eventName) => eventName === event)) return;
  if (socket) {
    socket.on(event, cb);
    callbacks.push(event);
  }
};

export const connectClient = (
  host: string,
  port: string,
  stationName: string,
) => {
  // const host = settings.$state.settings.filter(
  //   (setting) => setting.name === "serverAddress"
  // )[0];
  // const port = settings.$state.settings.filter(
  //   (setting) => setting.name === "serverPort"
  // )[0];
  // const stationName = settings.$state.settings.filter(
  //   (setting) => setting.name === "stationName"
  // )[0];

  socketConnected = false;
  station = {
    stationType: 1, // StationType.Workstation,
    stationName: stationName,
  };
  if (isFirstConnect) {
    const portNumber = port === "" || !port ? "" : `:${port}`;
    const hostName = `${host}${portNumber}`;
    socket = io(hostName);
    console.log(station);
    isFirstConnect = false;
  }
};

export const on = (event, cb) => {
  addOnCallback(event, cb);
};

export const emit = async (event, payload = {}) => {
  if (socket) {
    const message = { station: station, message: { ...payload } };
    socket.emit(event, message);
  }
};
