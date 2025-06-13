import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarItem } from "../api/carrinho";
import { UserContext } from "../contexts/UserContext";

const AdicionarAoCarrinho = ({ productsId }) => {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const handleAdicionar = () => {
    if (!productsId) {
      alert("productsId está vazio ou indefinido.");
      return;
    }

    adicionarItem(productsId, token)
      .then(() => {
        alert("Produto adicionado!");
        navigate("/Carrinho");
      })
      .catch((err) => {
        alert(err.message);
        navigate("/Login");
      });
  };

  return (
    <button
      onClick={handleAdicionar}
      className="mt-2 bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full transition-colors"
    >
      Adicionar ao Carrinho
    </button>
  );
};

export default AdicionarAoCarrinho;
