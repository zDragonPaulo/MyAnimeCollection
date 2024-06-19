import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface AnimeDetail {
    mal_id: number;
    title: string;
    score: number;
    synopsis: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
}

const AnimeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [anime, setAnime] = useState<AnimeDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`https://api.jikan.moe/v4/anime/${id}`)
            .then(response => response.json())
            .then((data) => {
                setAnime(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados da API:', error);
                setError('Erro ao buscar dados da API');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!anime) {
        return <div>Anime não encontrado</div>;
    }

    return (
        <div className="container">
            <h1 className="my-4">{anime.title}</h1>
            <div className="row">
                <div className="col-md-4">
                    <img src={anime.images.jpg.image_url} alt={anime.title} className="img-fluid" />
                </div>
                <div className="col-md-8">
                    <h5>Avaliação: {anime.score}</h5>
                    <p>{anime.synopsis}</p>
                </div>
            </div>
        </div>
    );
}

export default AnimeDetail;
