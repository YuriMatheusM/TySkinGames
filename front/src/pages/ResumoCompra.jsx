import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avaliacao from "./Avaliacao";

const ResumoCompra = () => {
  const [resumo, setResumo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dadosCompra = localStorage.getItem("resumoCompra");

    if (dadosCompra) {
      setResumo(JSON.parse(dadosCompra));
    } else {
      navigate("/");
    }
  }, []);

  if (!resumo) {
    return <p className="text-white mt-20 text-center">Carregando resumo...</p>;
  }

  const total = resumo.reduce(
    (acc, item) => acc + item.preco_unitario * item.quantidade,
    0
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col text-white mt-64 gap-2 w-3xl">
        <h1 className="text-4xl font-bold mb-6">Resumo da Compra</h1>

        <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-3xl">
          {resumo.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded-xl mb-4 flex justify-between"
            >
              <div>
                <p className="text-lg font-bold">{item.produto}</p>
                <p className="text-sm text-gray-300">
                  Quantidade: {item.quantidade}
                </p>
                <p className="text-sm text-gray-300">
                  Preço unitário: R$ {item.preco.toFixed(2)}
                </p>
              </div>
              <p className="text-lg font-semibold">
                R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
              </p>
            </div>
          ))}

          <hr className="my-4 border-gray-600" />
          <p className="text-right text-2xl font-bold">
            Total: R$ {total.toFixed(2)}
          </p>
        </div>
        <div>
          <Avaliacao />
        </div>
      </div>
    </div>
  );
};

export default ResumoCompra;
