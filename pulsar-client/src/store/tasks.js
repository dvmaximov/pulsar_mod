import { makeAutoObservable } from "mobx";
import api from "../services/api.service";

class Tasks {
  taskList = [];

  constructor() {
    makeAutoObservable(this);
  }

  fill(data) {
    this.taskList = data;
  }

  async fetch() {
    const answer = await api.fetch("api/tasks");
    this.fill(answer.result);
  }

  async fetchById(id) {
    const answer = await api.fetchById("api/tasks", id);
    return answer.result;
  }

  async remove(task) {
    const answer = await api.remove("api/tasks", task.id);
    const newData = this.taskList.filter((item) => item.id !== task.id);
    this.fill(newData);
    return answer.result;
  }

  async create(task) {
    const answer = await api.create("api/tasks", task);
    const newTask = answer.result;
    this.fill([...this.taskList, newTask]);
  }

  async update(task) {
    const answer = await api.update("api/tasks", task);
    let idx = this.taskList.findIndex((item) => item.id === task.id);
    this.taskList[idx] = { ...task };
    return answer.result;
  }
}

export const tasks = new Tasks();
