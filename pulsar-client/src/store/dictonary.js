import { makeAutoObservable } from "mobx";
import api from "../services/api.service";

class Dictonary {
  actionTypes = [];
  workTypes = [];
  statusTypes = [];
  WORK = {};
  STATUS = {};
  ACTION = {};

  constructor() {
    makeAutoObservable(this);
    this.fetch();
  }

  fill(data) {
    this.actionTypes = data.actionTypes;
    this.workTypes = data.workTypes;
    this.statusTypes = data.statusTypes;
    this.WORK = data.WORK;
    this.STATUS = data.STATUS;
    this.ACTION = data.ACTION;
  }

  async fetch() {
    const answer = await api.fetch("api/dictonary");
    this.fill(answer.result);
  }

  getStatus(statusId) {
    return this.statusTypes.find((item) => item.id === statusId);
  }
}

export const dictonary = new Dictonary();
