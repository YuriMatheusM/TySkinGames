import { Link } from "react-router-dom";
import API_URL from "../api/api";

const Filter = ({ products }) => {
  return (
    <Link to={`/Detalhe/${products.id}`}>
      <div className="">
        <div className="flex flex-row items-center gap-2 bg-gray-800 rounded p-2 max-w-md shadow-md">
          <img
            src={`${API_URL}/${products.imagem}`}
            alt={products.nome}
            className="rounded-xl w-24 h-14 object-cover"
          />
          <div className="flex flex-col mx-2 justify-center truncate max-w-xs">
            <h2 className="text-white text-lg font-semibold">
              {products.nome}
            </h2>

            {products.descricao && (
              <p className="text-gray-300 text-sm truncate max-w-xs">
                {products.descricao}
              </p>
            )}

            <p className="text-green-400 font-bold mt-1">
              {products.preco === 0
                ? "Sem preço, é exclusiva ❤️"
                : `R$ ${products.preco.toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Filter;
