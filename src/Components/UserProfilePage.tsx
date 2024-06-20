import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../UserContext";

const UserProfilePage: React.FC = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    console.log("Aqui " + user);

    setIsLoading(true);
    setLoadingMessage(
      "Carregando informações do usuário, por favor, aguarde..."
    );
    try {
      const response = await fetch(
        `https://myanimecollection-7a81.restdb.io/rest/animeusers?q={"email":"${user.email}"}`,
        {
          method: "GET",
          headers: {
            "x-apikey": "66744406f85595d7d606accb",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const data = await response.json();
      console.log("Dados recebidos da API:", data);

      if (data.length > 0) {
        setUserName(data[0].nome);
        setError(null);
      } else {
        console.error("Usuário não encontrado para o email fornecido");
        setUserName(null);
        setError("Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setUserName(null);
      setError("Erro ao buscar dados do usuário");
    } finally {
      console.log(userName);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const userImage = "user.png";

  return (
    <div className="container">
      <h1 className="my-4">Perfil do Utilizador</h1>
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <img
          src={userImage}
          className="card-img-top"
          alt="Imagem do Utilizador"
        />
        <div className="card-body text-center">
          {isLoading ? (
            <h5 className="card-title">{loadingMessage}</h5>
          ) : (
            <>
              {error ? (
                <h5 className="card-title">{error}</h5>
              ) : (
                <>
                  {userName !== null ? (
                    <>
                      <h5 className="card-title">{userName}</h5>
                      <p className="card-text">Gosto muito de anime!</p>
                      <h6>Listas de Anime:</h6>
                      <ul>
                        <li>Por Ver: {0} animes</li>
                        <li>A Ver: {0} animes</li>
                        <li>Completado: {0} animes</li>
                      </ul>
                    </>
                  ) : (
                    <h5 className="card-title">Carregando...</h5>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
