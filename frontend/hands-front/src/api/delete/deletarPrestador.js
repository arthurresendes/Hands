const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const deletarPrestador = async (email) => {
  const API_URL = `${BASE_URL}/api/v1/deletar_prestador/${email}`; 
  const response = await fetch(API_URL, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data
};