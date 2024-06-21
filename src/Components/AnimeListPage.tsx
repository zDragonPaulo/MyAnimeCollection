import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AnimeContext } from '../AnimeContext';
import { Link } from 'react-router-dom';

const AnimeListPage: React.FC = () => {
  const { listName } = useParams<{ listName: string }>();
  const { lists } = useContext(AnimeContext);

  console.log("Nome da lista recebido dos parâmetros:", listName);
  console.log("Listas disponíveis no contexto:", Object.keys(lists));

  // Normalizando o nome da lista para comparação
  const normalizedListName = listName?.toLowerCase().replace("-", " ");

  // Mapeando o nome normalizado para o nome da lista no contexto
  const listMapping: { [key: string]: keyof typeof lists } = {
    "por ver": "porVer",
    "a ver": "aVer",
    "completado": "completado"
  };

  const listKey = listMapping[normalizedListName as keyof typeof listMapping];
  const list = lists[listKey];

  // Função para colocar a primeira letra de cada palavra em maiúscula
  const capitalizeFirstLetter = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
