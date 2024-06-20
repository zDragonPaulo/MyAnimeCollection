// src/AnimeContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { saveAs } from 'file-saver';

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

interface AnimeContextType {
    animes: Anime[];
    setAnimes: (animes: Anime[]) => void;
    searchPerformed: boolean;
    setSearchPerformed: (performed: boolean) => void;
    addToList: (anime: Anime, list: string) => void;
    lists: {
        porVer: Anime[];
        aVer: Anime[];
        completado: Anime[];
    };
    saveListsToFile: () => void;
}

export const AnimeContext = createContext<AnimeContextType>({
    animes: [],
    setAnimes: () => {},
    searchPerformed: false,
    setSearchPerformed: () => {},
    addToList: () => {},
    lists: {
        porVer: [],
        aVer: [],
        completado: []
    },
    saveListsToFile: () => {}
});

export const AnimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [lists, setLists] = useState({
        porVer: [],
        aVer: [],
        completado: []
    });

    const removeFromLists = (anime: Anime) => {
        return {
            porVer: lists.porVer.filter(a => a.mal_id !== anime.mal_id),
            aVer: lists.aVer.filter(a => a.mal_id !== anime.mal_id),
            completado: lists.completado.filter(a => a.mal_id !== anime.mal_id),
        };
    };

    const addToList = (anime: Anime, list: string) => {
        setLists(prevLists => {
            const newList = removeFromLists(anime);
            newList[list].push(anime);
            return newList;
        });
    };

    const saveListsToFile = () => {
        const blob = new Blob([JSON.stringify(lists, null, 2)], { type: 'application/json' });
        saveAs(blob, 'anime_lists.json');
    };

    return (
        <AnimeContext.Provider value={{ animes, setAnimes, searchPerformed, setSearchPerformed, addToList, lists, saveListsToFile }}>
            {children}
        </AnimeContext.Provider>
    );
};
