import { makeAutoObservable } from "mobx";
import api from "../services/api.service";

class Works {
  workList = [];
  currentWork = null;

  constructor() {
    makeAutoObservable(this);
  }

  fill(data) {
    this.workList = data;
  }

  fillCurrentWork(data) {
      this.currentWork = data;
  }

  async fetch() {
    const answer = await api.fetch("api/works");
    this.fill(answer.result);
  }

  async fetchCurrentWork() {
    const answer = await api.fetch("api/works/currentWork");
    this.fillCurrentWork(answer.result);
  }

  async create(work) {
    const answer = await api.create("api/works", work);
    const newWork = answer.result;
    this.fill([...this.workList, newWork]);
  }

  async stopCurrent() {
    return await api.fetch("api/works/stopCurrent");
  }

  async remove(work) {
    const answer = await api.remove("api/works", work.id);
    const newWorks = this.workList.filter((item) => item.id !== work.id);
    this.fill(newWorks);
    return answer.result;
  }
}

export const works = new Works();
