import axios from 'axios';

const baseURL = 'https://crudcrud.com/api/6ca39aaf959a4021bab584a521dd7530';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		accept: 'application/json',
	}, 
});

export const callApi = ({
    url,
    method,
    data,
  }) =>
    axiosInstance({
      url,
      method: method || "GET",
      data,
    }).then(response => response.data);