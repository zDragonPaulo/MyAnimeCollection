import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../UserContext'; // Importa o contexto de usuário

interface AnimeDetail {
    mal_id: number;
    title: string;
    score: number;
    synopsis: string;
    episodes: { season: number }[];
    genres: { name: string }[];
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
    const [userRating, setUserRating] = useState<number | null>(null);
    const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
    const { user } = useUser(); // Obtém o usuário do contexto

    useEffect(() => {
        fetchAnimeDetail();
    }, [id]);


    const fetchAnimeDetail = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const data = await response.json();
            setAnime(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            setError('Erro ao buscar dados da API');
            setLoading(false);
        }
    };

    const renderStars = (score: number) => {
        const stars = Math.round(score / 2);
        return (
            <div>
                {Array.from({ length: 5 }, (_, index) => (
                    <span key={index}>
                        {index < stars ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    const renderRatingStars = () => {
        return (
            <div>
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setUserRating(index + 1)}
                    >
                        {index < (userRating ?? 0) ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    const submitUserRating = async () => {
        if (userRating !== null && user?.id_utilizador !== null) {
            try {
                const numericalRating = userRating * 2;
                const ratingInfo = {
                    mal_id: anime?.mal_id,
                    id_utilizador: user.id_utilizador, // Usar o id_utilizador do contexto
                    avaliacao: numericalRating
                };

                const submitResponse = await fetch('https://myanimecollection-87e3.restdb.io/rest/animeavaliacao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': '667848c79f6f5e5fc939ee20'
                    },
                    body: JSON.stringify(ratingInfo)
                });

                if (!submitResponse.ok) {
                    throw new Error('Erro ao enviar avaliação');
                }

                alert(`Você avaliou este anime com ${userRating} estrelas (${numericalRating} pontos)!`);
                setShowRatingForm(false);
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error);
                alert('Erro ao enviar avaliação');
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center">
                <div className="mx-auto">
                    <img src="loading.gif" width="30" height="30" alt="Carregando" />
                </div>
            </div>
        );
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
                    <h5>Gêneros:</h5>
                    <ul>
                        {anime.genres.map((genre, index) => (
                            <li key={index}>{genre.name}</li>
                        ))}
                    </ul>
                    <h5>Avaliação: {renderStars(anime.score)}</h5>
                    <button className="btn btn-secondary" onClick={() => setShowRatingForm(!showRatingForm)}>
                        Avaliar
                    </button>
                    {showRatingForm && (
                        <div>
                            {renderRatingStars()}
                            <button className="btn btn-secondary" onClick={submitUserRating}>Enviar Avaliação</button>
                        </div>
                    )}
                    <h5>Número de Episódios: {anime.episodes}</h5>
                    <h5>Sinopse:</h5>
                    <p>{anime.synopsis}</p>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;
