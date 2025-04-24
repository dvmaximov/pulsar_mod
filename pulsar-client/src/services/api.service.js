import axios from "axios";

const host = `${location.protocol}//${location.hostname}`;

class ApiService {
  async fetch(path) {
    const res = await axios.get(`${host}/${path}`);
    return res.data;
  }

  async rotateCW(path,angle) {
    const res = await axios.get(`${host}/${path}/${angle}`);
    return res.data;
  }

  async rotateCCW(path,angle) {
    console.log(`${host}/${path}/${angle}`)
    const res = await axios.get(`${host}/${path}/${angle}`);
    console.log(res);
    return res.data;
  }

  async fetchById(path, id) {
    const res = await axios.get(`${host}/${path}/${id}`);
    return res.data;
  }

  async create(path, value) {
    const res = await axios.post(`${host}/${path}`, value);
    return res.data;
  }

  async remove(path, id) {
    const res = await axios.delete(`${host}/${path}/${id}`);
    return res.data;
  }

  async update(path, value) {
    const res = await axios.put(`${host}/${path}/${value.id}`, value);
    return res.data;
  }

  async repair(path) {
    return await axios.post(`${host}/${path}`);
  }

  async backup(path) {
    await axios({
      url: `${host}/${path}`,
      method: "GET",
      responseType: "blob", // Important
    }).then((response) => {
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], { type: type, encoding: "UTF-8" });
      const link = document.createElement("a");
      const fileName = response.headers["content-disposition"]
        .split("filename=")[1]
        .replace(/"/g, "");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  }

  async restore(path, value) {

    const answer = {
      result: null,
      error: null,
    };
    // let db = null;
    // try {
      // db = JSON.parse(value);
      // db = value;
      // if (!db["settings"]) {
      //   answer.error = "Неправильное содержимое файла.";
      //   return answer;
      // }

    // } catch (e) {
    //   answer.error = e;
    //   return answer;
    // }
    const formData = new FormData();
    formData.append('restore', value);
    console.log(`${host}/${path}`)
    return await axios.post(`${host}/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
    // return await axios.post(`${host}/${path}`, db);
  }
}

export default new ApiService();
