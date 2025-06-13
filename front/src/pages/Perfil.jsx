import { useContext, useEffect, useState } from "react";
import API_URL from "../api/api";
import { UserContext } from "../contexts/UserContext";

const Perfil = () => {
  const { token } = useContext(UserContext);
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch(`${API_URL}/Perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.erro);
        setUsuario(data);
      } catch (erro) {
        console.error("Erro ao Carregar o Perfil:", erro.mensage);
      }
    };
    fetchPerfil();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("nome", nome);
    form.append("username", username);
    form.append("email", email);
    if (foto) form.append("foto", foto);

    const res = await fetch(`${API_URL}/AtualizarCadastro`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    alert(data.mensagem || data.erro);
  };

  if (!usuario)
    return (
      <div className="flex">
        <p className="flex mt-64 mx-auto justify-center text-3xl text-white text-center">
          Carregando Perfil...
        </p>
      </div>
    );

  return (
    <div className="flex flex-wrap mx-24">
      <div className="flex-col relative mt-40 mx-5 bg-gray-800 shadow-lg rounded-xl px-20 py-14 text-white gap-3 text-center">
        {usuario.foto ? (
          <img
            src={usuario?.foto ? `${API_URL}/${usuario.foto}` : "Sem foto"}
            alt="Perfil"
            className="w-64 h-64 mx-auto rounded-full border-2 border-gray-600"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4" />
        )}

        <h2 className="text-2xl font-semibold">{usuario.nome}</h2>
        <p className="">@{usuario.username}</p>
      </div>
      <div className="flex flex-col relative rounded-xl p-18 mt-40 px-32 bg-gray-800">
        <h1 className="font-bold text-3xl text-white text-center mb-24">
          Editar cadastro
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col gap-16"
        >
          <div className=" gap-12 flex flex-wrap text-white justify-items-start mx-auto">
            <div>
              <label className="block mb-1">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border-2 border-black text-white rounded-2xl w-90 px-5 py-2"
                placeholder={usuario.nome}
              />
            </div>
            <dir>
              <label className="block mb-1">Username:</label>
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-black rounded-2xl w-90 px-5 py-2"
                placeholder={usuario.username}
              />
            </dir>
          </div>
          <div className="text-start flex flex-wrap gap-16 text-white">
            <div>
              <label className="block mb-1">Foto:</label>
              <input
                type="file"
                accept="foto"
                onChange={(e) => setFoto(e.target.files[0])}
                className="w-90 px-5 py-2 border-2 rounded-2xl cursor-pointer border-black"
              />
            </div>
            <dir>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-black rounded-2xl w-90 px-5 py-2"
                placeholder={usuario.email}
              />
            </dir>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-2xl mx-auto cursor-pointer hover:bg-red-400"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};
export default Perfil;
