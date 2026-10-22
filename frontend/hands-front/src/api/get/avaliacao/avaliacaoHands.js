const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/v1/ver_avaliacoes_hands`;

export const avaliacoesHands = async () => {
  const response = await fetch(API_URL, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.avaliacoes;
};