import axios from "axios";

const api = axios.create({
  baseURL: "/api",       // Vite proxy üzerinden
  withCredentials: false // JWT'de cookie yok
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
