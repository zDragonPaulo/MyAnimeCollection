// src/Components/AnimePage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import { AnimeContext } from '../AnimeContext';
import './images.css';
import { FaCheck } from 'react-icons/fa';

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
    const { addToList, lists } = useContext(AnimeContext);

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

    const isAddedToList = (anime: Anime) => {
        return lists.porVisualizar.some(a => a.mal_id === anime.mal_id) ||
               lists.aVisualizar.some(a => a.mal_id === anime.mal_id) ||
               lists.completado.some(a => a.mal_id === anime.mal_id);
    };

    return (
        <div className="container">
            <h1 className="my-4">Animes Populares</h1>
            <div className="row">
                {animes.map(anime => (
                    <div key={anime.mal_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100 position-relative">
                            <Link to={`/anime/${anime.mal_id}`}>
                                <img src={anime.images.jpg.image_url} alt={anime.title} className="card-img-top fixed-image" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">{anime.title}</h5>
                                <p className="card-text">Avaliação: {anime.score}</p>
                            </div>
                            <Dropdown className="position-absolute" style={{ bottom: 10, right: 10 }}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {isAddedToList(anime) ? <FaCheck /> : '+'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => addToList(anime, 'Por visualizar')}>Por visualizar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => addToList(anime, 'A visualizar')}>A visualizar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => addToList(anime, 'Completado')}>Completado</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnimePage;
