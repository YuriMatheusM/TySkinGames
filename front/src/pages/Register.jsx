import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import PasswordInput from "../components/PasswordInput";

const Register = () => {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("senha", senha);
    if (foto) {
      formData.append("foto", foto);
    }

    fetch(`${API_URL}/RegistroUser`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Erro no registro");
          });
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        navigate("/Login");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-4xl shadow-md w-full max-w-md">
        <h2 className="text-4xl text-white font-bold mb-6 text-center">
          Cadastrar
        </h2>
        {error && (
          <p className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleRegistro} className="space-y-4">
          <label className="block text-white mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 px-4 rounded-3xl bg-gray-700 focus:outline-none"
            required
          />
          <label className="block text-white mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 px-4 rounded-3xl bg-gray-700 focus:outline-none"
            required
          />
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 p-2 rounded-3xl bg-gray-700 focus:outline-none"
            required
          />
          <label className="block text-white mb-1">Senha</label>
          <PasswordInput
            className="rounded-3xl"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <label className="block text-white mb-1">Foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
            className="w-full px-4 p-2 rounded-3xl cursor-pointer bg-gray-700 focus:outline-none"
          />

          <button
            type="submit"
            className="w-48 mx-auto block mt-9 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-full py-4"
          >
            Registrar
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <p className="text-sm text-white text-center">
            Já tem conta?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Register;
