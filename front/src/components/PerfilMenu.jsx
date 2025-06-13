import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api/api";
import PerfilDefault from "../assets/perfildefault.png";
import { UserContext } from "../contexts/UserContext";

const PerfilMenu = () => {
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Logout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative pr-10 flex flex-col">
      <button
        className="hover:bg-gray-700 active:scale-95 p-1 cursor-pointer rounded-full transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={user?.foto ? `${API_URL}/${user.foto}` : PerfilDefault}
          alt="Perfil"
          className="w-20 h-20 rounded-full border-2 border-gray-600"
        />
      </button>
      {isOpen && (
        <div className="absolute right-28 top-21 bg-gray-700 rounded-2xl px-6 py-4 flex flex-col items-center space-y-3 shadow-md min-w-[160px]">
          {user ? (
            <>
              <p className="text-white font-semibold">
                {user.nome || "Usuário"}
              </p>
              <Link
                to="/Perfil"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </Link>
              <Link
                to="/Carrinho"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Carrinho
              </Link>
              <Link
                to="/Historico"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Histórico
              </Link>
              <button
                onClick={Logout}
                className="text-red-400 hover:text-red-600 mt-2"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/Login"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </Link>
              <Link
                to="/Carrinho"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Carrinho
              </Link>
              <Link
                to="/Historico"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Histórico
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilMenu;
