import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const searchAnime = async (query: string) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw`);
      const data = await response.json();
      console.log(data);
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
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Página Inicial
          </a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <form className="d-flex mx-auto" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
              <input
                type="search"
                placeholder="Diga o nome anime..."
                className="form-control me-2"
                value={query}
                onChange={handleInputChange}
              />
              <button className="btn btn-outline-success" type="submit">
                Procurar
              </button>
            </form>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/user">
                  Perfil
                </a>
              </li>
            </ul>
          </div>
      </nav>
    </>
  );
};

export default Navbar;
