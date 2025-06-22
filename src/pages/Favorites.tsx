import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Hotel } from '../types/Hotel';
import { useAuth } from '../context/AuthContext';
import { Button, Typography, Card, CardContent, Grid, Alert, Container } from '@mui/material';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'user') {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get<Hotel[]>('/favorites');
      setFavorites(response.data);
      setError(null);
    } catch (err: any) {
      setError('加載收藏失敗');
    }
  };

  const addFavorite = async (hotelId: string) => {
    if (user?.role === 'user') {
      try {
        await api.post('/favorites/add', { hotelId });
        fetchFavorites();
      } catch (err: any) {
        setError('添加收藏失敗');
      }
    }
  };

  const removeFavorite = async (hotelId: string) => {
    if (user?.role === 'user') {
      try {
        await api.delete('/favorites/remove', { data: { hotelId } });
        fetchFavorites();
      } catch (err: any) {
        setError('移除收藏失敗');
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center">我的最愛</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {favorites.map((fav) => (
          <Grid item xs={12} sm={6} md={4} key={fav._id}>
            <Card>
              <CardContent>
                <Typography>{fav.name}</Typography>
                <Button onClick={() => removeFavorite(fav._id)}>移除</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites;