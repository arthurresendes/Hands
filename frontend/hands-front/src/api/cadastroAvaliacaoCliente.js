const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/v1/avaliar_clientes`; 

export const cadastroAvaliacaoCliente = async (payload) => {
  const response = await fetch(API_URL, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data.id_resultado
};