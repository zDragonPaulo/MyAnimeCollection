import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AnimeContext } from "../AnimeContext";
import { useUser } from "../UserContext";
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { setAnimes, setSearchPerformed, saveListsToFile } = useContext(AnimeContext);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const searchAnime = async (query: string) => {
    try {
      setAnimes([]);
      setSearchPerformed(false);

      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw`);
      const data = await response.json();

      setAnimes(data.data);
      setSearchPerformed(true);
      navigate("/search-results");
    } catch (error) {
      console.error("Erro ao buscar animes:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchAnime(query);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="icon.png" width="30" height="30" alt="Logo" /> 𝓜𝔂 𝓐𝓷𝓲𝓶𝓮 𝓒𝓸𝓵𝓵𝓮𝓬𝓽𝓲𝓸𝓷
        </a>
        <button className="navbar-toggler" type="button" onClick={toggleNav}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <form className="d-flex mx-auto" onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
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
            {user ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/profile">
                    <FaUser /> Perfil
                  </a>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    <FaSignInAlt /> Iniciar Sessão
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/register">
                    <FaUserPlus /> Registar
                  </a>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className="btn btn-secondary" onClick={saveListsToFile}>
                Salvar Listas
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
