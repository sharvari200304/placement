import axios from "axios";

const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  const defaultUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
  const baseUrl = configuredUrl || defaultUrl;

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/api`;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl()
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
