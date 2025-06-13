import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import Filter from "./Filter";

const Buscar = () => {
  const [busca, setBusca] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResultados, setShowResultados] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResultados(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/Buscar?q=${encodeURIComponent(busca)}`
        );
        const data = await response.json();
        setProducts(data.resultados || []);
        setShowResultados(true);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (busca.trim().length > 0) {
      fetchProdutos();
    } else {
      setProducts([]);
      setShowResultados(false);
    }
  }, [busca]);

  const handleProdutoClick = (id) => {
    setShowResultados(false);
    navigate(`/Detalhe/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-100 mx-auto">
      <div className="bg-gray-950 rounded-full flex items-center justify-center">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="text-white p-6 rounded-full w-full focus:outline-none focus:ring-2  focus:ring-gray-400"
        />
        <Search className="text-white w-20 h-7 justify-end-safe" />
      </div>

      {showResultados && (
        <div className="absolute bg-gray-900 mt-2 rounded-xl shadow-lg overflow-y-auto p-2 space-y-0 max-h-96 ">
          {loading ? (
            <p className="text-white">Carregando...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-400">Nenhum resultado encontrado.</p>
          ) : (
            products.map((produto) => (
              <div
                key={produto.item_id}
                onClick={() => handleProdutoClick(produto.item_id)}
                className="cursor-pointer hover:bg-gray-400 rounded p-1 transition"
              >
                <Filter products={{ ...produto, id: produto.item_id }} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Buscar;
