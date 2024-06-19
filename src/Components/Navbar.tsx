import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AnimeContext } from '../AnimeContext';

const Navbar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const { setAnimes, setSearchPerformed, saveListsToFile } = useContext(AnimeContext);
  const navigate = useNavigate();

  const searchAnime = async (query: string) => {
    try {
      setAnimes([]); // Limpa os resultados anteriores
      setSearchPerformed(false); // Reseta o estado de pesquisa

      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw`);
      const data = await response.json();

      setAnimes(data.data);
      setSearchPerformed(true); // Define que uma pesquisa foi realizada
      navigate('/search-results'); // Redireciona para a página de resultados da pesquisa
    } catch (error) {
      console.error('Erro ao buscar animes:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchAnime(query);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="icon.png" width="30" height="30" alt="Logo"/> 𝓜𝔂 𝓐𝓷𝓲𝓶𝓮 𝓒𝓸𝓵𝓵𝓮𝓬𝓽𝓲𝓸𝓷
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <form className="d-flex mx-auto" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
            <input
              type="search"
              placeholder="Diga o nome anime..."
              className="form-control me-2"
              value={query}
              onChange={handleInputChange}
            />
            <button className="btn btn-outline-success" type="submit">Procurar</button>
          </form>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/user">
                <img src="user.png" width="30" height="30" alt="Utilizador"/>
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary" onClick={saveListsToFile}>Save Lists</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
