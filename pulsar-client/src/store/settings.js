import format from "date-fns/format";
import { makeAutoObservable } from "mobx";
import api from "../services/api.service";

class Settings {
  settingList = [];
  SETTING = {};
  serverTime = "";

  constructor() {
    makeAutoObservable(this);
  }

  setServerTime(value) {
    this.serverTime = format(value, "dd-MM-yyyy - HH:mm");
  }

  fill(data) {
    this.settingList = data;
  }

  fillSETTING(data) {
    this.SETTING = data;
  }

  async fetch() {
    const answer = await api.fetch("api/settings");
    this.fill(answer.settings.result);
    this.fillSETTING(answer.SETTING);
    await api.fetch("api/settings/serverTime");
  }

  async update(setting) {
    await api.update("api/settings", setting);

    const newSettings = [...this.settingList];
    const idx = newSettings.findIndex((item) => item.id === setting.id);
    newSettings[idx] = { ...setting };
    this.fill(newSettings);
  }

  async updateServer() {
    setTimeout(() => {
      window.close();
    }, 2000);
    await api.fetch(`api/settings/updateServer`);
  }

  async backup() {
    await api.backup("api/settings/backup");
  }

  async repair() {
    setTimeout(() => {
      window.close();
    }, 2000);
    await api.repair("api/settings/repair");
  }

  async restore(value) {
    setTimeout(() => {
      window.close();
    }, 2000);
    return await api.restore("api/settings/restore", value);
  }

  async shutdown() {
    setTimeout(() => {
      window.close();
    }, 2000);
    await api.fetch(`api/settings/shutdown`);
  }

  async calibrateAzimuth(time) {
    return await api.fetch(`api/works/calibrateAzimuth?time=${time}`);
  }

  async calibrateSlope(time) {
    return await api.fetch(`api/works/calibrateSlope?time=${time}`);
  }
}

export const settings = new Settings();
