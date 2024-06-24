import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AnimeContext } from "../AnimeContext";
import { useUser } from "../UserContext";
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import logo from "/src/assets/icon.png";

const Navbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>("animes");
  const { setAnimes, setSearchPerformed, saveListsToRestDB } =
    useContext(AnimeContext);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const searchAnime = async (query: string) => {
    try {
      setAnimes([]);
      setSearchPerformed(false);

      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&sfw`
      );
      const data = await response.json();

      setAnimes(data.data);
      setSearchPerformed(true);
      navigate("/search-results");
    } catch (error) {
      console.error("Erro ao buscar animes:", error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const apiUrl = `https://myanimecollection-87e3.restdb.io/rest/animeusers?q={"nome":"${query}"}`;
      console.log("URL da API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-apikey": "667848c79f6f5e5fc939ee20",
          "Content-Type": "application/json",
        },
        mode: "cors",
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar utilizadores");
      }

      console.log("Resposta bruta da API:", response);

      const data = await response.json();
      console.log("Dados JSON da API:", data);

      if (data.length === 0) {
        console.warn("Nenhum utilizador encontrado para a query:", query);
      }

      navigate("/user-search-results", { state: { users: data } });
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchType === "animes") {
      searchAnime(query);
    } else if (searchType === "users") {
      searchUsers(query);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSaveLists = async () => {
    console.log("Botão de guardar listas clicado");
    await saveListsToRestDB();
    alert("As listas foram atualizadas")
    console.log("Função saveListsToRestDB chamada");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={logo} width="30" height="30" alt="Logo" /> 𝓜𝔂 𝓐𝓷𝓲𝓶𝓮
          𝓒𝓸𝓵𝓵𝓮𝓬𝓽𝓲𝓸𝓷
        </a>
        <button className="navbar-toggler" type="button" onClick={toggleNav}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-6 mb-lg-0"></ul>
          <form
            className="d-flex mx-auto"
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px" }}
          >
            <select
              className="form-select me-4"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="animes">Animes</option>
              <option value="users">Utilizadores</option>
            </select>
            <input
              type="search"
              placeholder={`Pesquisa...`}
              className="form-control me-4"
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
                  <a className="nav-link" href={`/user/${user.id_utilizador}`}>
                    <FaUser /> Perfil
                  </a>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
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
              <button className="btn btn-secondary" onClick={handleSaveLists}>
                Guardar Listas
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
