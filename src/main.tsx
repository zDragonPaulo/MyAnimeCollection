// src/main.tsx
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
import UserProfilePage from './Components/UserProfilePage'; // Importar o novo componente

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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile", // Adicionar a nova rota
        element: <UserProfilePage />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
