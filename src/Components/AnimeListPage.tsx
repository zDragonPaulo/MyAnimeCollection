import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimeContext } from '../AnimeContext';

const AnimeListPage: React.FC = () => {
  const { id, listName } = useParams<{ id: string, listName: string }>();
  const { fetchAnimeListsByUserId } = useContext(AnimeContext);
  const [lists, setLists] = useState({
    porVer: [],
    aVer: [],
    completado: []
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const normalizedListName = listName?.toLowerCase().replace("-", " ");
  const listMapping: { [key: string]: keyof typeof lists } = {
    "por ver": "porVer",
    "a ver": "aVer",
    "completado": "completado"
  };

  const listKey = listMapping[normalizedListName as keyof typeof listMapping];
  const list = lists[listKey];

  const capitalizeFirstLetter = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (isLoading) {
    return <h5>Carregando listas...</h5>;
  }

  if (error) {
    return <h5>{error}</h5>;
  }

  if (!list) {
    return <h5>Lista não encontrada</h5>;
  }

  return (
    <div className="container">
      <h1 className="my-4">{capitalizeFirstLetter(normalizedListName)}</h1>
      <div className="row">
        {list.map((anime) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeListPage;
