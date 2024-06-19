import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface SearchAnimePageProps {
  animes: Anime[];
}

const SearchAnimePage: React.FC<SearchAnimePageProps> = ({ animes }) => {
  return (
    <div className="container">
      <h1 className="my-4">Resultados da Pesquisa</h1>
      <div className="row">
        {animes.length > 0 ? (
          animes.map(anime => (
            <div key={anime.mal_id} className="col-md-2 mb-4">
              <div className="card h-100">
                <img src={anime.images.jpg.image_url} alt={anime.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{anime.title}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default SearchAnimePage;
