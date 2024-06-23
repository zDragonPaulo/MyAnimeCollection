import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

interface User {
  id_utilizador: number;
  nome: string;
  email: string;
  aniversario: string;
  // Adicione outras propriedades conforme necessário
}

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://myanimecollection-87e3.restdb.io/rest/animeusers?q={"id_utilizador":${userId}}`,
          {
            method: "GET",
            headers: {
              "x-apikey": "667848c79f6f5e5fc939ee20",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário");
        }
        const data = await response.json();
        if (data.length > 0) {
          setUser(data[0]);
        } else {
          setError("Usuário não encontrado");
        }
      } catch (error) {
        setError("Erro ao buscar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Nenhum utilizador encontrado.</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4">Perfil do Utilizador</h1>
      <div className="row">
        <div className="col-md-4 text-center">
          <img
            src="user.png"
            className="img-fluid rounded-circle"
            alt="Imagem do Utilizador"
            style={{ maxWidth: "150px" }}
          />
          <h5 className="mt-2">{user.nome}</h5>
        </div>
        <div className="col-md-8">
          {user.aniversario && (
            <p>
              <strong>Aniversário:</strong> {user.aniversario}
            </p>
          )}
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Biografia:</strong> Eu adoro anime!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
