import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useUser } from "../UserContext";
import { AnimeContext } from "../AnimeContext";
import { FaCheck } from "react-icons/fa";
import "./images.css"; // Ensure this CSS file contains styles for fixed-image and other necessary styles

interface Anime {
  mal_id: number;
  title: string;
  score: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface User {
  id_utilizador: number;
  nome: string;
  email: string;
  aniversario: string;
  // Adicione outras propriedades conforme necessário
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obter o ID do utilizador da URL
  const { user } = useUser();
  const { lists, addToList } = useContext(AnimeContext);
  const [userName, setUserName] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setLoadingMessage("Carregando informações do usuário, por favor, aguarde...");
    try {
      const response = await fetch(
        `https://myanimecollection-7a81.restdb.io/rest/animeusers?q={"id_utilizador":${id}}`,
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

      if (data.length > 0) {
        setUserName(data[0].nome);
        setBirthday(data[0].aniversario);
        setBio("Eu adoro anime!");
        setError(null);
      } else {
        setUserName(null);
        setError("Usuário não encontrado");
      }
    } catch (error) {
      setUserName(null);
      setError("Erro ao buscar dados do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const userImage = "user.png";

  return (
    <div className="container">
      <h1 className="my-4">Perfil do Utilizador</h1>
      {isLoading ? (
        <h5>{loadingMessage}</h5>
      ) : (
        <>
          {error ? (
            <h5>{error}</h5>
          ) : (
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={userImage}
                  className="img-fluid rounded-circle"
                  alt="Imagem do Utilizador"
                  style={{ maxWidth: "150px" }}
                />
                <h5 className="mt-2">{userName}</h5>
              </div>
              <div className="col-md-8">
                {birthday && (
                  <p>
                    <strong>Aniversário:</strong> {birthday}
                  </p>
                )}
                {bio && (
                  <p>
                    <strong>Biografia:</strong> {bio}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="row mt-4">
        {renderAnimeList("Por Ver", lists.porVer, addToList)}
        {renderAnimeList("A Ver", lists.aVer, addToList)}
        {renderAnimeList("Completado", lists.completado, addToList)}
      </div>
    </div>
  );
};

const renderAnimeList = (title: string, animes: Anime[], addToList: (anime: Anime, list: string) => void) => (
  <div className="col-12 mb-4">
    <h5>
      <Link to={`/list/${title.toLowerCase().replace(" ", "-")}`}>{title}</Link>
    </h5>
    <div className="row">
      {animes.slice(0, 4).map((anime) => (
        <div key={anime.mal_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div className="card h-100 position-relative">
            <Link to={`/anime/${anime.mal_id}`}>
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="card-img-top fixed-image"
              />
            </Link>
            <div className="card-body">
              <h5 className="card-title">{anime.title}</h5>
              <p className="card-text">Avaliação: {anime.score}</p>
            </div>
            <Dropdown className="position-absolute" style={{ bottom: 10, right: 10 }}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <FaCheck />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => { e.preventDefault(); addToList(anime, "porVer"); }}>Por Ver</Dropdown.Item>
                <Dropdown.Item onClick={(e) => { e.preventDefault(); addToList(anime, "aVer"); }}>A Ver</Dropdown.Item>
                <Dropdown.Item onClick={(e) => { e.preventDefault(); addToList(anime, "completado"); }}>Completado</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserProfilePage;
