import axios from "axios";

// Configuración base
const baseConfig = {
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// API para autenticación (login, logout, refresh)
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE || "http://localhost:3000",
  ...baseConfig,
});

// API para libros (crear, actualizar, listar, eliminar)
export const bookApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_SERVICE || "http://localhost:3000",
  ...baseConfig,
});

// API para administración (usuarios, roles, permisos)
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_SERVICE || "http://localhost:3000",
  ...baseConfig,
});

// Manejo global de errores
const errorHandler = (error) => {
  console.error("❌ API Error:", error.response?.data || error.message);
  return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, errorHandler);
bookApi.interceptors.response.use((res) => res, errorHandler);
adminApi.interceptors.response.use((res) => res, errorHandler);
