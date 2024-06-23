import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";
import { AnimeContext } from "../AnimeContext";
import "./images.css"; // Certifique-se de que este arquivo CSS contenha estilos para fixed-image e outros estilos necessários
import userImage from '/src/assets/user.png';
import { useUser } from '../UserContext'; // Importe o contexto do usuário

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

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obter o ID do usuário da URL
  const { fetchAnimeListsByUserId } = useContext(AnimeContext);
  const [userName, setUserName] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Obter o usuário do contexto
  const [lists, setLists] = useState({
    porVer: [],
    aVer: [],
    completado: []
  });
  const listTypeToIdMap = {
    porVer: 1,
    aVer: 2,
    completado: 3
  };
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRatingForm, setShowRatingForm] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setLoadingMessage("Carregando informações do usuário, por favor, aguarde...");
    try {
      const response = await fetch(
        `https://myanimecollection-87e3.restdb.io/rest/animeusers?q={"id_utilizador":${id}}`,
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
        setUserName(data[0].nome);
        setBirthday(data[0].aniversario);
        setBio("Eu adoro anime!");
        setError(null);
        const animeLists = await fetchAnimeListsByUserId(data[0].id_utilizador);
        setLists(animeLists);
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

  const renderRatingStars = () => {
    return (
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            style={{ cursor: 'pointer' }}
            onClick={() => setUserRating(index + 1)}
          >
            {index < (userRating ?? 0) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const submitUserRating = async () => {
    if (userRating !== null && user?.id_utilizador !== null && showRatingForm) {
      try {
        const listType = showRatingForm as keyof typeof lists;
        const numericalRating = userRating * 2;
        const ratingInfo = {
          id_lista: listTypeToIdMap[listType], // Usando o mapeamento para obter o ID correto
          id_utilizador: id,
          id_utilizador_avaliador: user.id_utilizador,
          avaliacao: numericalRating
        };


        const submitResponse = await fetch('https://myanimecollection-87e3.restdb.io/rest/listaavaliacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '667848c79f6f5e5fc939ee20'
          },
          body: JSON.stringify(ratingInfo)
        });

        if (!submitResponse.ok) {
          throw new Error('Erro ao enviar avaliação');
        }

        alert(`Você avaliou esta lista com ${userRating} estrelas (${numericalRating} pontos)!`);
        setShowRatingForm(null);
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Erro ao enviar avaliação');
      }
    }
  };

  const renderAnimeList = (userId: string, title: string, animes: Anime[], listType: string) => (
    <div className="col-12 mb-4">
      <h5>
        <Link to={`/user/${userId}/list/${title.toLowerCase().replace(" ", "-")}`}>{title}</Link>
        <button className="btn btn-secondary" onClick={() => setShowRatingForm(listType)}>Avaliar Lista</button>
        {showRatingForm === listType && (
        <div className="mt-3">
          {renderRatingStars()}
          <button className="btn btn-secondary" onClick={submitUserRating}>Enviar Avaliação</button>
        </div>
      )}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
        {renderAnimeList(id!, "Por Ver", lists.porVer, "porVer")}
        {renderAnimeList(id!, "A Ver", lists.aVer, "aVer")}
        {renderAnimeList(id!, "Completado", lists.completado, "completado")}
      </div>
    </div>
  );
};

export default UserProfilePage;
