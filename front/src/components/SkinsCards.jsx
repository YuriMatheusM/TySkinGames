import { Link } from "react-router-dom";
import API_URL from "../api/api";
import AdicionarAoCarrinho from "./Carrinho";
import FinalizarCompra from "./FinalizarCompra";

const SkinsCards = ({ products }) => {
  return (
    <div className="flex flex-col bg-gray-800 shadow-lg p-4 w-64 relative hover:scale-105 transition-transform mb-30 rounded-3xl mx-13">
      <Link to={`/Detalhe/${products.id}`} className="no-underline">
        <img
          src={`${API_URL}/${products.imagem}`}
          alt={products.nome}
          className="rounded-xl mb-4 w-full h-48 object-cover"
        />

        <h2 className="text-white text-lg font-semibold mb-2 text-center">
          {products.nome}
        </h2>

        {products.descricao && (
          <p className="text-gray-300 text-sm mb-4 text-center">
            {products.descricao}
          </p>
        )}

        <p className="text-green-400 font-bold text-center">
          {products.preco === 0
            ? "Sem preço, é exclusiva ❤️"
            : `R$ ${products.preco.toFixed(2)}`}
        </p>
      </Link>
      <div>
        <AdicionarAoCarrinho productsId={products.id} />
        <FinalizarCompra
          itens={[products]}
          className="mt-2 bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full transition-colors"
        >
          Comprar
        </FinalizarCompra>
      </div>
    </div>
  );
};

export default SkinsCards;
