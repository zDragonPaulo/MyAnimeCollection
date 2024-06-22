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
    const { id, userId } = useParams<{ id: string; userId: string }>();
    const [anime, setAnime] = useState<AnimeDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [prevSeason, setPrevSeason] = useState<number | null>(null);
    const [nextSeason, setNextSeason] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
    const [apiUserId, setApiUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchAnimeDetail();
    }, [id]);

    useEffect(() => {
        if (userId) {
            fetchUserId(userId).then((apiId) => {
                setApiUserId(apiId);
            });
        }
    }, [userId]);

    useEffect(() => {
        if (anime && anime.episodes.length > 0) {
            const seasons = Array.from(new Set(anime.episodes.map(episode => episode.season)));
            seasons.sort((a, b) => a - b);

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

    const fetchUserId = async (userId: string): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://myanimecollection-7a81.restdb.io/rest/animeusers?q={"id_utilizador":"${userId}"}`,
                {
                    method: "GET",
                    headers: {
                        "x-apikey": "66744406f85595d7d606accb",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar ID do usuário');
            }

            const data = await response.json();
            if (data.length > 0) {
                return data[0].id_utilizador;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar ID do usuário:', error);
            return null;
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
        if (userRating !== null && apiUserId !== null) {
            try {
                const numericalRating = userRating * 2;
                const ratingInfo = {
                    mal_id: anime?.mal_id,
                    id_utilizador: apiUserId,
                    avaliacao: numericalRating
                };

                const submitResponse = await fetch('https://myanimecollection-7a81.restdb.io/rest/animeavaliacao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': '66744406f85595d7d606accb'
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
};

export default AnimeDetail;
