import { ShoppingBasket } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCarrinho, limparCarrinho, removerItem } from "../api/carrinho";
import FinalizarCompra from "../components/FinalizarCompra";
import { UserContext } from "../contexts/UserContext";

const Carrinho = () => {
  const [itens, setItens] = useState([]);
  const [setErro] = useState("");
  const [total, setTotal] = useState(0);
  const { token } = useContext(UserContext);

  const totalProducts = (itens) => {
    const soma = itens.reduce((acc, item) => acc + item.preco, 0);
    setTotal(soma);
  };

  const carregarCarrinho = () => {
    getCarrinho()
      .then((dados) => {
        setItens(dados);
        totalProducts(dados);
      })
      .catch((err) => setErro(err.message));
  };

  useEffect(() => {
    if (token) {
      carregarCarrinho();
    }
  }, [token]);

  const handleRemover = (itemId) => {
    removerItem(itemId)
      .then(() => carregarCarrinho())
      .catch((err) => setErro(err.message));
  };

  const handleLimpar = () => {
    limparCarrinho()
      .then(() => carregarCarrinho())
      .catch((err) => setErro(err.message));
  };

  return (
    <div className="flex justify-center">
      {itens.length === 0 ? (
        <div className="w-2xl h-72 mt-64 flex flex-col items-center justify-start bg-gray-800 py-5 rounded-3xl">
          <h1 className=" text-white text-4xl mb-6">Carrinho</h1>
          <ShoppingBasket className="h-24 w-24" />
          <p className="text-2xl mt-14 text-center">
            Seu carrinho está vazio.
            <Link to="/">
              <button className="cursor-pointer text-blue-800 hover:text-blue-700 rounded-2xl px-2">
                Continuar comprando
              </button>
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          <div className="w-3xl mt-40 bg-gray-800 p-4 rounded-3xl">
            <h1 className="text-3xl text-white text-center font-bold mb-4">
              Itens
            </h1>
            <ul className="space-y-4 flex flex-col ">
              {itens.map((item) => (
                <li
                  key={item.item_id}
                  className="flex justify-between items-center bg-gray-400 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-gray-600">R$ {item.preco.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemover(item.item_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <div className="">
              <button
                onClick={handleLimpar}
                className="mt-6 bg-gray-700 hover:bg-red-400 text-black px-6 py-3 rounded-2xl"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
          <div className="mt-40 w-96 h-96 relative bg-gray-800 p-4 justify-between transition-transform rounded-3xl mx-5">
            <h1 className="text-3xl text-white text-center font-bold mb-4">
              Resumo
            </h1>
            <p>subtotal</p>
            <p className="text-white text-center text-3xl mt-32">
              Total: R$ {total.toFixed(2)}
            </p>
            <FinalizarCompra itens={itens} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;
