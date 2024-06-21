import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";

interface User {
  id_utilizador: number;
  nome: string;
  email: string;
  // Adicione outras propriedades conforme necessário
}

const UserSearchResults: React.FC = () => {
  const location = useLocation();
  const users: User[] = location.state?.users || [];

  return (
    <div className="container">
      <h1 className="my-4">Resultados da Pesquisa por Utilizadores</h1>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id_utilizador} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.nome}</h5>
                  <p className="card-text">{user.email}</p>
                  <Link to={`/user/${user.id_utilizador}`} className="btn btn-primary">
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum utilizador encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default UserSearchResults;
