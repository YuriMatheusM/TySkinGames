import API_URL from "./api";

const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const getCarrinho = async () => {
  const res = await fetch(`${API_URL}/Carrinho`, { headers });
  if (!res.ok) throw new Error("Erro ao buscar carrinho");
  return res.json();
};

export const adicionarItem = async (productsId, token) => {
  if (!productsId) {
    throw new Error("productsId está vazio ou indefinido.");
  }

  if (!token) {
    throw new Error("Faça login ou cadastre-se para adicionar ao carrinho.");
  }

  const res = await fetch(`${API_URL}/adicionarItens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ products_id: productsId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || "Erro ao adicionar item");
  }

  return res.json();
};

export const removerItem = async (itemId) => {
  const res = await fetch(`${API_URL}/carrinho/item/${itemId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Erro ao remover item");
  return res.json();
};

export const limparCarrinho = async () => {
  const res = await fetch(`${API_URL}/limparCarrinho`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Erro ao limpar carrinho");
  return res.json();
};
