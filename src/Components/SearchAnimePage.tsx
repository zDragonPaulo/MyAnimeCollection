import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { AnimeContext } from '../AnimeContext';
import { Dropdown } from 'react-bootstrap';

const SearchAnimePage: React.FC = () => {
  const { animes, searchPerformed, addToList } = useContext(AnimeContext);

  return (
    <div className="container">
      {searchPerformed && <h1 className="my-4">Resultados da Pesquisa</h1>}
      <div className="row">
        {searchPerformed && animes.length > 0 ? (
          animes.map(anime => (
            <div key={anime.mal_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 position-relative">
                <Link to={`/anime/${anime.mal_id}`}>
                  <img src={anime.images.jpg.image_url} alt={anime.title} className="card-img-top fixed-image" />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{anime.title}</h5>
                </div>
                <Dropdown className="position-absolute" style={{ bottom: 10, right: 10 }}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    +
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => addToList(anime, 'Por visualizar')}>Por visualizar</Dropdown.Item>
                    <Dropdown.Item onClick={() => addToList(anime, 'A visualizar')}>A visualizar</Dropdown.Item>
                    <Dropdown.Item onClick={() => addToList(anime, 'Completado')}>Completado</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))
        ) : (
          searchPerformed && <p>Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default SearchAnimePage;
