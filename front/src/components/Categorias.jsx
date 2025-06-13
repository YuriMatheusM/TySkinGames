import { useEffect, useRef, useState } from "react";

const Categorias = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative flex flex-col items-center">
      <button onClick={() => setIsOpen(!isOpen)}>
        <span className="hover:text-gray-400 cursor-pointer text-xl">
          Categorias
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-50 right-10 top-10 bg-gray-700 rounded-2xl px-6 py-4 flex flex-col items-center space-y-3 shadow-md">
          <a href="#" className="text-white hover:text-gray-300">
            Categoria 1
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Categoria 2
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Categoria 3
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Categoria 4
          </a>
        </div>
      )}
    </div>
  );
};
export default Categorias;
