import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 60000,
  withCredentials: true,
});
