import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './Components/ErrorPage.tsx';
import AnimePage from './Components/AnimePage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    // Página de Erro
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <AnimePage/>,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);