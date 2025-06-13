import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import PasswordInput from "../components/PasswordInput";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Email ou senha inválidos");
        }
        return res.json();
      })
      .then((data) => {
        login(data.usuario, data.access_token);
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-4xl shadow-md w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Login
        </h2>
        {error && (
          <p className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 px-4 rounded-3xl bg-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Senha</label>
            <PasswordInput
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-48 mx-auto block bg-blue-600 hover:bg-blue-700 text-white py-4 cursor-pointer rounded-4xl transition"
          >
            Entrar
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Não tem uma conta?{" "}
          <Link to="/Cadastro" className="text-blue-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
