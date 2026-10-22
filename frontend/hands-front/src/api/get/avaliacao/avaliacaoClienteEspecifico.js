const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const avaliacaoClienteEspecifico = async (email) => {
  const API_URL = `${BASE_URL}/api/v1/ver_minhas_avaliacoes_cliente/${email}`; 
  const response = await fetch(API_URL, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return { 
    avaliacoes_recebidas: data.avaliacoes_recebidas, 
    total: data.total 
  };
};