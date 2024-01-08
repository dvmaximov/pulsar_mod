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

export const reconnect = (
  host: string,
  port: string | number,
  stationName: string,
) => {
  station = {
    stationType: 1, // StationType.Workstation,
    stationName: stationName,
  };
  const portNumber =
    port === "" || !port || port === 0 || port === "0" ? "" : `:${port}`;
  const hostName = `${host}${portNumber}`;
  console.log(hostName);
  if (socketConnected) {
    socketConnected = false;
    socket.disconnect();
    socket.hostName = hostName;
    console.log(socket.hostName);
    socket.connect();
  } else {
    connectClient(host, port, stationName);
  }
};

export const connectClient = (
  host: string,
  port: string | number,
  stationName: string,
) => {
  socketConnected = false;
  station = {
    stationType: 1, // StationType.Workstation,
    stationName: stationName,
  };
  if (isFirstConnect) {
    const portNumber =
      port === "" || !port || port === 0 || port === "0" ? "" : `:${port}`;
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
