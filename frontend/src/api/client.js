import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export const getData = (response) => response.data?.data ?? response.data;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("placement_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const detail = Array.isArray(data?.errors)
      ? data.errors.map((item) => item.message).filter(Boolean).join(", ")
      : "";
    const message = detail || data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
