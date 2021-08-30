import axios from "axios";

const baseURL = "https://crudcrud.com/api/4b16a97834304f4d8f5d715c10434633";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    accept: "application/json",
  },
});

export const callApi = ({ url, method, data }) =>
  axiosInstance({
    url,
    method: method || "GET",
    data,
  }).then(response => response.data);
