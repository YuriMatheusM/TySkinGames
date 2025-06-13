import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "../components/header";
import Carrinho from "../pages/Carrinho";
import Comentarios from "../pages/Comentarios";
import Historico from "../pages/Historico";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Perfil from "../pages/Perfil";
import ProductsDetails from "../pages/ProdutsDetails";
import Register from "../pages/Register";
import ResumoCompra from "../pages/ResumoCompra";
import Suport from "../pages/Suport";

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Detalhe/:id" element={<ProductsDetails />} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Register />} />
        <Route path="/Comentarios" element={<Comentarios />} />
        <Route path="/Suporte" element={<Suport />} />
        <Route path="/Resumo-da-Compra" element={<ResumoCompra />} />
        <Route path="/Historico" element={<Historico />} />
        <Route path="/Perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
