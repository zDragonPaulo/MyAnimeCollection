import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { AnimeContext } from "../AnimeContext";
import "./images.css";
import { FaCheck } from "react-icons/fa";

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

interface ApiResponse {
  data: Anime[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
}

const AnimePage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const { addToList, lists } = useContext(AnimeContext);

  useEffect(() => {
    fetchAnimes(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchAnimes(page, false);
    }
  }, [page]);

  const fetchAnimes = (page: number, initialLoad: boolean) => {
    setLoading(true);
    fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`)
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setAnimes((prevAnimes) =>
          initialLoad ? data.data : [...prevAnimes, ...data.data]
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API:", error);
        setError("Erro ao buscar dados da API");
        setLoading(false);
      });
  };

  const handleScroll = () => {
    console.log("Scroll detected");
    if (
      document.documentElement.clientHeight + window.scrollY >=
        document.documentElement.scrollHeight &&
      !loading
    ) {
      console.log("Loading more animes");
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  if (error) {
    return <div>{error}</div>;
  }

  const isAddedToList = (anime: Anime) => {
    return (
      lists.porVer.some((a) => a.mal_id === anime.mal_id) ||
      lists.aVer.some((a) => a.mal_id === anime.mal_id) ||
      lists.completado.some((a) => a.mal_id === anime.mal_id)
    );
  };

  return (
    <div className="container">
      <h1 className="my-4">Animes Populares</h1>
      <div className="row">
        {animes.map((anime) => (
          <div
            key={anime.mal_id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
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
              <Dropdown
                className="position-absolute"
                style={{ bottom: 10, right: 10 }}
              >
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {isAddedToList(anime) ? <FaCheck /> : "+"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      addToList(anime, "porVer");
                    }}
                  >
                    Por Ver
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      addToList(anime, "aVer");
                    }}
                  >
                    A Ver
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      addToList(anime, "completado");
                    }}
                  >
                    Completado
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="d-flex align-items-center">
          <div className="mx-auto">
            <img src="loading.gif" width="30" height="30" alt="Carregando" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimePage;
