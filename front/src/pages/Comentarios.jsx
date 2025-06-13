import { useEffect, useState } from "react";
import API_URL from "../api/api";

const Comentarios = () => {
  const [comentarios, setComentario] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/Comentarios`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar comentarios no servidor!");
        }
        return response.json();
      })
      .then((data) => {
        setComentario(data);
      });
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-gray-800 py-7 w-3xl flex flex-col mt-64 gap-2 rounded-2xl">
        <h2 className="text-5xl text-white text-center mb-7 font-bold">
          Comentarios
        </h2>
        {comentarios.length === 0 ? (
          <p className="text-white text-2xl text-center">
            Nenhum comentario ainda!
          </p>
        ) : (
          comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className="bg-gray-900 flex mx-auto w-2xl rounded-2xl"
            >
              <div className="mx-3 py-2">
                <p className="text-white">
                  <strong>{comentario.user_name}</strong>
                </p>
                <p className="font-mono text-white break-all break-words whitespace-pre-wrap w-full">
                  {comentario.comentario}
                </p>
                <small className="text-white">
                  {new Date(comentario.data).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Comentarios;
