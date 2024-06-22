import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useUser } from './UserContext';

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
  saveListsToRestDB: () => void;
  fetchAnimeLists: () => void;
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
  saveListsToRestDB: () => {},
  fetchAnimeLists: () => {}
});

export const AnimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [lists, setLists] = useState({
    porVer: [],
    aVer: [],
    completado: []
  });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchAnimeLists();
    }
  }, [user]);

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
  const fetchAnimeListsByUserId = async (userId: number) => {
    try {
      const response = await fetch(
        `https://myanimecollection-7a81.restdb.io/rest/listasanimes?q={"id_utilizador":${userId}}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '66744406f85595d7d606accb'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar listas de animes');
      }

      const data = await response.json();
      console.log('Listas de animes buscadas:', data);

      const newLists = {
        porVer: [],
        aVer: [],
        completado: []
      };

      data.forEach((list: any) => {
        if (list.id_lista === 1) {
          newLists.porVer = list.lista_animes;
        } else if (list.id_lista === 2) {
          newLists.aVer = list.lista_animes;
        } else if (list.id_lista === 3) {
          newLists.completado = list.lista_animes;
        }
      });

      return newLists;
    } catch (error) {
      console.error('Erro ao buscar listas de animes:', error);
      return {
        porVer: [],
        aVer: [],
        completado: []
      };
    }
  };

  const saveListsToRestDB = async () => {
    if (!user || !user.id_utilizador) {
      console.error('Usuário não está autenticado ou ID do usuário não está disponível');
      return;
    }
  
    const dataToSave = [
      { id_lista: 1, id_utilizador: user.id_utilizador, lista_animes: lists.porVer },
      { id_lista: 2, id_utilizador: user.id_utilizador, lista_animes: lists.aVer },
      { id_lista: 3, id_utilizador: user.id_utilizador, lista_animes: lists.completado },
    ];
  
    try {
      for (const data of dataToSave) {
        console.log(`Verificando lista com id_utilizador: ${user.id_utilizador} e id_lista: ${data.id_lista}`);
        const checkResponse = await fetch(
          `https://myanimecollection-7a81.restdb.io/rest/listasanimes?q={"id_utilizador":${user.id_utilizador},"id_lista":${data.id_lista}}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-apikey': '66744406f85595d7d606accb'
            },
          }
        );
  
        if (!checkResponse.ok) {
          const errorText = await checkResponse.text();
          console.error(`Erro ao verificar a lista: ${checkResponse.statusText} - ${errorText}`);
          throw new Error(`Erro ao verificar a lista: ${checkResponse.statusText} - ${errorText}`);
        }
  
        const existingLists = await checkResponse.json();
        console.log(`Listas existentes: ${JSON.stringify(existingLists)}`);
  
        let method = 'POST';
        let url = 'https://myanimecollection-7a81.restdb.io/rest/listasanimes';
        if (existingLists.length > 0) {
          method = 'PATCH';
          url = `https://myanimecollection-7a81.restdb.io/rest/listasanimes/${existingLists[0]._id}`;
        }
  
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '66744406f85595d7d606accb'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro ao salvar a lista: ${response.statusText} - ${errorText}`);
          throw new Error(`Erro ao salvar a lista: ${response.statusText} - ${errorText}`);
        }
        console.log(`Lista com id_lista: ${data.id_lista} salva com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao salvar listas:', error);
    }
  };
  
  const fetchAnimeLists = async () => {
    if (!user || !user.id_utilizador) {
      console.error('Usuário não está autenticado ou ID do usuário não está disponível');
      return;
    }

    try {
      const response = await fetch(
        `https://myanimecollection-7a81.restdb.io/rest/listasanimes?q={"id_utilizador":${user.id_utilizador}}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '66744406f85595d7d606accb'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar listas de animes');
      }

      const data = await response.json();
      console.log('Listas de animes buscadas:', data);

      const newLists = {
        porVer: [],
        aVer: [],
        completado: []
      };

      data.forEach((list: any) => {
        if (list.id_lista === 1) {
          newLists.porVer = list.lista_animes;
        } else if (list.id_lista === 2) {
          newLists.aVer = list.lista_animes;
        } else if (list.id_lista === 3) {
          newLists.completado = list.lista_animes;
        }
      });

      setLists(newLists);
    } catch (error) {
      console.error('Erro ao buscar listas de animes:', error);
    }
  };

  return (
    <AnimeContext.Provider value={{ animes, setAnimes, searchPerformed, setSearchPerformed, addToList, lists, saveListsToRestDB, fetchAnimeLists, fetchAnimeListsByUserId }}>
      {children}
    </AnimeContext.Provider>
  );
};
