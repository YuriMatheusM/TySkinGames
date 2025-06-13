import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Categorias from "../components/Categorias";
import PerfilMenu from "../components/PerfilMenu";
import Buscar from "./Search";

const Header = () => {
  return (
    <header className="fixed h-24 left-0 w-full backdrop-blur-md flex justify-between z-50 mx-5 gap-12 items-center ">
      <div className="flex h-20 w-20 rounded-full bg-gray-950 text-2xl align-text-start">
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="w-20 h-20 rounded-full border-0 border-gray-700"
          />
        </Link>
      </div>
      <div>
        <nav className=" bg-gray-950 p-6 w-150 rounded-full">
          <ul className="flex justify-center-safe space-x-20 text-white text-xl">
            <li>
              <Categorias />
            </li>
            <li>
              <Link to="/Comentarios" className="hover:text-gray-400">
                Comentarios
              </Link>
            </li>
            <li>
              <Link to={"/Suporte"} className="hover:text-gray-400">
                Suporte
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Buscar />
      </div>
      <PerfilMenu />
    </header>
  );
};
export default Header;
