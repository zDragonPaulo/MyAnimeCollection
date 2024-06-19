import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Definição dos tipos dos dados retornados pela API
interface Anime {
    mal_id: number;
    title: string;
    score: number;
    images: {
        jpg: {
            image_url: string;
        };
    };
}

interface ApiResponse {
    data: Anime[];
}


const AnimePage: React.FC = () => {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.jikan.moe/v4/top/anime')
            .then(response => response.json())
            .then((data: ApiResponse) => {
                setAnimes(data.data.slice(0, 24));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados da API:', error);
                setError('Erro ao buscar dados da API');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <h1 className="my-4">Animes Populares</h1>
            <div className="row">
                {animes.map(anime => (
                    <div key={anime.mal_id} className="col-md-3 mb-4">
                        <div className="card h-100">
                            <img src={anime.images.jpg.image_url} alt={anime.title} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{anime.title}</h5>
                                <p className="card-text">Score: {anime.score}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnimePage;
