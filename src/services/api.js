import axios from "axios";

const baseURL = "https://crudcrud.com/api/b514c1d2901d465ea630cd5d001067d6";

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
