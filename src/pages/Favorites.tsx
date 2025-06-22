import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Hotel } from '../types/Hotel';
import { useAuth } from '../context/AuthContext';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

useEffect(() => {
  if (user?.role === 'user') { // 改為 'user'
    fetchFavorites();
  }
}, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get<Hotel[]>('/favorites');
      setFavorites(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch favorites');
    }
  };

const addFavorite = async (hotelId: string) => {
  if (user?.role === 'user') { // 改為 'user'
    try {
      await api.post('/favorites', { hotelId });
      fetchFavorites();
    } catch (err: any) {
      setError('無法添加收藏');
    }
  }
};

const removeFavorite = async (hotelId: string) => {
  if (user?.role === 'user') { // 改為 'user'
    try {
      await api.delete(`/favorites/${hotelId}`);
      fetchFavorites();
    } catch (err: any) {
      setError('無法移除收藏');
    }
  }
};

  return (
    <div style={{ margin: '20px' }}>
      <h2>Favorites</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user?.role === 'public' && (
        <button
          onClick={() => addFavorite('someHotelId')}
          style={{ padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', marginBottom: '10px' }}
        >
          Add Favorite
        </button>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {favorites.map((fav) => (
          <li key={fav._id} style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
            {fav.name}
            {user?.role === 'public' && (
              <button onClick={() => removeFavorite(fav._id)} style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;