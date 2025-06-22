import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Hotel } from '../types/Hotel';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const response = await api.get<Hotel[]>('/favorites');
    setFavorites(response.data);
  };

  const addFavorite = async (hotelId: string) => {
    await api.post('/favorites', { hotelId });
    fetchFavorites();
  };

  return (
    <div>
      <button onClick={() => addFavorite('someHotelId')}>Add Favorite</button>
      <ul>
        {favorites.map((fav) => (
          <li key={fav._id}>{fav.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;