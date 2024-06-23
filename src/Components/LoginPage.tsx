import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../UserContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log("Fetching user data...");
      const response = await fetch(
        `https://myanimecollection-cdd2.restdb.io/rest/animeusers?q={"email":"${email}"}`,
        {
          method: "GET",
          headers: {
            "x-apikey": "6675a683be0bc8beb8eafe89",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const data = await response.json();
      console.log("User data fetched:", data);

      if (data.length === 0) {
        setError("Usuário não encontrado");
        return;
      }

      const userTest = data[0];
      console.log("Fetched user:", userTest);

      if (userTest.password === password) {
        delete userTest.password; // Remover a senha antes de definir o usuário
        setUser({
          id_utilizador: userTest.id_utilizador, // Usar a propriedade correta
          username: userTest.nome,
          email: userTest.email,
          // Adicione outras propriedades conforme necessário
        });
        navigate("/"); // Redirecionamento após login bem-sucedido
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      setError("Erro ao autenticar usuário");
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
