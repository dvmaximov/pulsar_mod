import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ApiResult, initResult } from "../api/api.interface";

const host = "http://localhost:5000/";

@Injectable()
export class ApiService {
  async create(table: string, value: unknown): Promise<ApiResult> {
    const answer: ApiResult = { ...initResult };
    try {
      const result = await axios.post(`${host}${table}`, value);
      answer.result = result.data;
    } catch (e) {
      answer.result = null;
      answer.error = e;
    }
    return answer;
  }

  async getAll(table: string): Promise<ApiResult> {
    const answer: ApiResult = { ...initResult };
    try {
      const result = await axios.get(`${host}${table}`);
      answer.result = result.data;
    } catch (e) {
      answer.error = e;
    }
    return answer;
  }

  async getById(table: string, id: unknown): Promise<any> {
    const answer: ApiResult = { ...initResult };
    try {
      const result = await axios.get(`${host}${table}/${id}`);
      answer.result = result.data;
    } catch (e) {
      answer.error = e;
    }
    return answer;
  }

  async update(table: string, id: unknown, value: unknown): Promise<any> {
    const answer: ApiResult = { ...initResult };
    try {
      const result = await axios.put(`${host}${table}/${id}`, value);
      answer.result = result.data;
    } catch (e) {
      answer.error = e;
    }
    return answer;
  }

  async delete(table: string, id: unknown): Promise<any> {
    const answer: ApiResult = { ...initResult };
    try {
      const result = await await axios.delete(`${host}${table}/${id}`);
      answer.result = result.data;
    } catch (e) {
      answer.error = e;
    }
    return answer;
  }
}
