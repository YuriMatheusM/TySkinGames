import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";

const Avaliacao = () => {
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const enviarComentario = async () => {
    const token = localStorage.getItem("token"); // JWT salvo após login

    if (!token) {
      setMensagem("Você precisa estar logado para comentar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comentario", comentario);

      const response = await fetch(`${API_URL}/Avaliacao`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Comentário enviado com sucesso!");
        setComentario("");
        navigate("/");
      }
      if (response == null || response == "") {
        setMensagem(data.erro || "Campo obrigatorio");
      } else {
        setMensagem(data.erro || "Erro ao enviar comentário.");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="flex bg-gray-800 rounded-3xl">
      <div className="p-4 shadow text-white">
        <h2 className="text-lg font-bold mb-2">Deixe seu comentário</h2>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-2xl p-2 rounded bg-gray-800 text-white"
          rows={4}
          placeholder="Escreva seu comentário..."
        ></textarea>
        <button
          onClick={enviarComentario}
          className="mt-3 bg-gray-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Enviar
        </button>
        {mensagem && <p className="mt-2 text-sm text-green-400">{mensagem}</p>}
      </div>
    </div>
  );
};

export default Avaliacao;
