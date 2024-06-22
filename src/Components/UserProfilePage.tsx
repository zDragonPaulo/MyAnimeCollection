import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";
import { AnimeContext } from "../AnimeContext";
import "./images.css"; // Ensure this CSS file contains styles for fixed-image and other necessary styles
import userImage from '/src/assets/user.png';

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

interface AnimeList {
  id: string;
  title: string;
  animes: Anime[];
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obter o ID do utilizador da URL
  const { fetchAnimeListsByUserId } = useContext(AnimeContext);
  const [userName, setUserName] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<{ [key: string]: number | null }>({});
  const [showRatingForm, setShowRatingForm] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [lists, setLists] = useState<AnimeList[]>([]);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      try {
        const animeLists = await fetchAnimeListsByUserId(Number(id));
        setLists(animeLists);
      } catch (error) {
        setError("Erro ao buscar listas de animes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
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

  const renderStars = (score: number) => {
    const stars = Math.round(score / 2); // Converter pontuação de 0-10 para 0-5
    return (
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>
            {index < stars ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const renderRatingStars = (listId: string) => {
    return (
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            style={{ cursor: 'pointer' }}
            onClick={() => setUserRating({ ...userRating, [listId]: index + 1 })}
          >
            {index < (userRating[listId] ?? 0) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const fetchUserId = async (userId: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://myanimecollection-7a81.restdb.io/rest/animeusers?q={"id_utilizador":"${userId}"}`,
        {
          method: "GET",
          headers: {
            "x-apikey": "66744406f85595d7d606accb",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar ID do usuário');
      }

      const data = await response.json();
      if (data.length > 0) {
        return data[0].id_utilizador;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar ID do usuário:', error);
      return null;
    }
  };

  const submitUserRating = async (listId: string) => {
    if (userRating[listId] !== null) {
      const userApiId = await fetchUserId(id!);
      if (!userApiId) {
        alert('Usuário não encontrado');
        return;
      }

      const numericalRating = (userRating[listId] ?? 0) * 2;

      try {
        const response = await fetch('https://myanimecollection-7a81.restdb.io/rest/listaavaliacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '66744406f85595d7d606accb'
          },
          body: JSON.stringify({
            id_lista: listId,
            id_utilizador: id,
            id_utilizador_avaliador: userApiId,
            avaliacao: numericalRating
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao enviar avaliação');
        }

        alert(`Você avaliou esta lista com ${userRating[listId]} estrelas (${numericalRating} pontos)!`);
        setShowRatingForm({ ...showRatingForm, [listId]: false });
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Erro ao enviar avaliação');
      }
    }
  };

  const renderAnimeList = (list: AnimeList) => (
    <div className="col-12 mb-4" key={list.id}>
      <h5>
        <Link to={`/user/${id}/list/${list.title.toLowerCase().replace(" ", "-")}`}>{list.title}</Link>
        {showRatingForm[list.id] ? (
          <div>
            {renderRatingStars(list.id)}
            <button className="btn btn-secondary" onClick={() => submitUserRating(list.id)}>Enviar Avaliação</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setShowRatingForm({ ...showRatingForm, [list.id]: true })}>Avaliar Lista</button>
        )}
      </h5>
      <div className="row">
        {list.animes.slice(0, 4).map((anime) => (
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
                <p className="card-text">Avaliação: {renderStars(anime.score)}</p>
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
        {lists.map((list) => renderAnimeList(list))}
      </div>
    </div>
  );
};

export default UserProfilePage;
