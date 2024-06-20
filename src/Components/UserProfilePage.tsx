// src/Components/UserProfilePage.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfilePage: React.FC = () => {
    const userName = 'Nome do Utilizador'; // Substitua isso pela lógica de obtenção do nome do utilizador
    const userImage = 'user.png'; // Imagem de perfil por defeito

    return (
        <div className="container">
            <h1 className="my-4">Perfil do Utilizador</h1>
            <div className="card mx-auto" style={{ maxWidth: '400px' }}>
                <img src={userImage} className="card-img-top" alt="Imagem do Utilizador" />
                <div className="card-body text-center">
                    <h5 className="card-title">{userName}</h5>
                    <p className="card-text">Gosto muito de anime!</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
