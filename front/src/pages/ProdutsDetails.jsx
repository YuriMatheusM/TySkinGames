import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../api/api";
import AdicionarAoCarrinho from "../components/Carrinho";
import FinalizarCompra from "../components/FinalizarCompra";

const ProductsDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/getProducts`)
      .then((response) => response.json())
      .then((data) => {
        const selectedProduct = data.find((item) => item.id === parseInt(id));
        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          console.error("Produto não encontrado");
        }
      })
      .catch((error) => console.error("Erro na API:", error));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-white text-2xl">Carregando detalhes do produto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-6">
      <h1 className="text-white text-6xl font-bold mb-20 mt-56 text-center">
        Detalhes do Produto
      </h1>
      <div className="flex justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-white text-3xl font-bold mb-4">{product.nome}</h2>
          <p className="text-gray-400 mb-4">{product.descricao}</p>
          <p className="text-white text-xl mb-4">
            Preço: R$ {product.preco.toFixed(2)}
          </p>
          <FinalizarCompra
            itens={[
              {
                id: product.id,
                nome: product.nome,
                preco: product.preco,
                quantidade: 1,
              },
            ]}
            className="bg-gray-600 text-white font-bold w-full py-2 rounded-full hover:bg-blue-700 transition duration-300"
          />
          <AdicionarAoCarrinho productsId={product.id} />
        </div>
      </div>
    </div>
  );
};
export default ProductsDetails;
