import { io } from "socket.io-client";

let socket = null;
let callbacks = [];
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
  socketConnected = false;
  station = {
    stationType: 1, // StationType.Workstation,
    stationName: stationName,
  };
  if (isFirstConnect) {
    const portNumber = port === "" || !port ? "" : `:${port}`;
    const hostName = `${host}${portNumber}`;
    socket = io(hostName);
    isFirstConnect = false;
  }
  addOnCallback("connect", () => {
    console.log("socket connect");
    emit("registration");
    socketConnected = true;
  });

  addOnCallback("disconnect", async (reason) => {
    console.log("socket disconnect", reason);
    callbacks = [];
    socketConnected = false;
  });

  // addOnCallback("getStationSettings", async (reason) => {
  //   console.log(reason);
  // });
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
