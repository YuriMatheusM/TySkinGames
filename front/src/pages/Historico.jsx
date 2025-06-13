import { useEffect, useState } from "react";
import API_URL from "../api/api";

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/Historico`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data) => {
        setHistorico(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar histórico:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex">
        <p className="flex mt-64 mx-auto justify-center text-3xl text-white text-center">
          Carregando histórico...
        </p>
      </div>
    );

  if (historico.length === 0)
    return (
      <div className="flex">
        <p className="flex mt-92 mx-auto justify-center text-3xl text-white text-center">
          Sem histórico de compras.
        </p>
        ;
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col mt-64 py-6 w-3xl bg-gray-800 gap-7 rounded-2xl text-white">
        <h2 className="text-4xl text-center font-bold ">
          Histórico de Compras
        </h2>
        <ul className="mx-14 border-white">
          {historico.map((item) => (
            <li key={item.id}>
              <p className="font-black text-2xl">{item.produto_nome}</p>
              <p>
                Preço: R$
                {item.preco_unitario.toFixed(2)}
              </p>{" "}
              <p>Data: {item.data_compra}</p>
              <hr className="border-t my-4" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Historico;
