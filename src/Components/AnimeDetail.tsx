import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface AnimeDetail {
    mal_id: number;
    title: string;
    score: number;
    synopsis: string;
    episodes: number[];
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
            const seasons = anime.episodes.map(episode => episode.season);
            seasons.sort((a, b) => a - b); // Classificar as temporadas em ordem crescente

            // Encontrar a temporada anterior e a próxima temporada
            const currentSeasonIndex = seasons.indexOf(anime.episodes[0].season);
            if (currentSeasonIndex > 0) {
                setPrevSeason(seasons[currentSeasonIndex - 1]);
            }
            if (currentSeasonIndex < seasons.length - 1) {
                setNextSeason(seasons[currentSeasonIndex + 1]);
            }
        }
    }, [anime]);

    if (loading) {
        return <div>{loading && (
            <div className="d-flex align-items-center">
              <div className="mx-auto">
              <img src="loading.gif" width="30" height="30" alt="Carregando" />
              </div>
            </div>
          )}</div>;
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
                    <h5>Avaliação: {anime.score}</h5>
                    <h5>Número de Episódios: {anime.episodes}</h5>
                    {prevSeason !== null && (
                        <p>Temporada Anterior: {prevSeason}</p>
                    )}
                    {nextSeason !== null && (
                        <p>Próxima Temporada: {nextSeason}</p>
                    )}
                    <p>{anime.synopsis}</p>
                </div>
            </div>
        </div>
    );
}

export default AnimeDetail;
