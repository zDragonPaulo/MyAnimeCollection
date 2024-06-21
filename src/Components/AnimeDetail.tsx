import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
    const [prevSeason, setPrevSeason] = useState<number | null>(null);
    const [nextSeason, setNextSeason] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [showRatingForm, setShowRatingForm] = useState<boolean>(false);

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

    useEffect(() => {
        if (anime && anime.episodes.length > 0) {
            // Obter temporadas únicas
            const seasons = Array.from(new Set(anime.episodes.map(episode => episode.season)));
            seasons.sort((a, b) => a - b); // Classificar as temporadas em ordem crescente

            // Encontrar a temporada anterior e a próxima temporada
            const currentSeason = anime.episodes[0].season;
            const currentSeasonIndex = seasons.indexOf(currentSeason);

            if (currentSeasonIndex > 0) {
                setPrevSeason(seasons[currentSeasonIndex - 1]);
            }
            if (currentSeasonIndex < seasons.length - 1) {
                setNextSeason(seasons[currentSeasonIndex + 1]);
            }
        }
    }, [anime]);

    const renderStars = (score: number) => {
        const stars = Math.round(score / 2); // Converter pontuação de 0-10 para 0-5
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

    const submitUserRating = () => {
        if (userRating !== null) {
            alert(`Você avaliou este anime com ${userRating} estrelas!`);
            setShowRatingForm(false);
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
                    <h5>Número de Episódios: {anime.episodes.length}</h5>
                    {prevSeason !== null && (
                        <p>Temporada Anterior: {prevSeason}</p>
                    )}
                    {nextSeason !== null && (
                        <p>Próxima Temporada: {nextSeason}</p>
                    )}
                    <h5>Sinopse:</h5>
                    <p>{anime.synopsis}</p>
                </div>
            </div>
        </div>
    );
}

export default AnimeDetail;
