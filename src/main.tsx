import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import AnimePage from './Components/AnimePage';
import AnimeDetail from './Components/AnimeDetail';
import SearchAnimePage from './Components/SearchAnimePage';

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
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
