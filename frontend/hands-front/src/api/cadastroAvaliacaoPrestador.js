const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/v1/total_clientes`;

export const totalClientes = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.totalClientes;
};