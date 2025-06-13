import { useEffect, useState } from "react";
import API_URL from "../api/api";
import SkinsCards from "../components/SkinsCards";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/getProducts`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Erro ao buscar os produtos:", error));
  }, []);

  return (
    <div className="min-h-screen w-full  flex flex-col p-6">
      <h1 className="text-white text-6xl font-bold mb-20 mt-56 text-center">
        Skins
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {products.map((product) => (
          <SkinsCards key={product.id} products={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
