import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import { limparCarrinho } from "../api/carrinho";
import { UserContext } from "../contexts/UserContext";

const FinalizarCompra = ({ itens, className, children }) => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const finalizarCompra = async () => {
    try {
      const response = await fetch(`${API_URL}/FinalizarCompra`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itens }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro da API:", data);
        throw new Error(data.erro || "Erro ao finalizar compra");
      }
      await limparCarrinho();
      localStorage.setItem("resumoCompra", JSON.stringify(itens));
      navigate("/Resumo-da-Compra");
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível finalizar a compra.");
    }
  };

  return (
    <button
      onClick={finalizarCompra}
      className={
        className ||
        "bg-gray-700 hover:bg-red-400 rounded-2xl mt-10 mx-auto block py-3 px-14"
      }
    >
      {children || "Comprar"}
    </button>
  );
};

export default FinalizarCompra;
