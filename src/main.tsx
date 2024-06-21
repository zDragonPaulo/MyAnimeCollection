import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import AnimePage from './Components/AnimePage';
import AnimeDetail from './Components/AnimeDetail';
import SearchAnimePage from './Components/SearchAnimePage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import UserProfilePage from './Components/UserProfilePage';
import AnimeListPage from './Components/AnimeListPage';
import UserSearchResults from './Components/UserSearchResults'; // Importando o novo componente

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <AnimePage />,
      },
      {
        path: "anime/:id",
        element: <AnimeDetail />,
      },
      {
        path: "search-results",
        element: <SearchAnimePage />,
      },
      {
        path: "user-search-results", // Adicionando a nova rota
        element: <UserSearchResults />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "user/:id", // Rota para visualizar perfil do utilizador com base no ID
        element: <UserProfilePage />
      },
      {
        path: "user/:id/list/:listName",
        element: <AnimeListPage />
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
