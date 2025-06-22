import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Hotel } from '../types/Hotel';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  Chip,
  Alert, // 添加 Alert 導入
} from '@mui/material';

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stars, setStars] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHotels = useCallback(async () => {
    try {
      const params = { location, minPrice, maxPrice, stars, facilities: facilities.join(',') };
      const response = await api.get<Hotel[]>('/hotels', { params });
      setHotels(response.data);
      setError(null);
    } catch (err: any) {
      setError(`無法獲取酒店: ${err.message}`);
      setMessage(err.message || '請檢查網絡連接');
      setOpen(true);
    }
  }, [location, minPrice, maxPrice, stars, facilities]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'operator') return;
    const hotelData = { name: 'New Hotel', location, price: parseFloat(minPrice) || 0 };
    if (hotelData.price < 0 || !hotelData.location) {
      setError('無效的酒店數據');
      setMessage('價格必須非負且位置為必填');
      setOpen(true);
      return;
    }
    try {
      await api.post('/hotels', hotelData);
      fetchHotels();
      setMessage('酒店添加成功');
      setOpen(true);
    } catch (err: any) {
      setError('無法添加酒店');
      setMessage(err.message);
      setOpen(true);
    }
  };

  const handleUpdateHotel = async (id: string) => {
    if (!user || user.role !== 'operator') return;
    const newPrice = parseFloat(maxPrice) || 0;
    if (newPrice < 0) {
      setError('價格必須非負');
      setMessage('無效的價格');
      setOpen(true);
      return;
    }
    try {
      await api.put(`/hotels/${id}`, { price: newPrice });
      fetchHotels();
      setMessage('酒店更新成功');
      setOpen(true);
    } catch (err: any) {
      setError('無法更新酒店');
      setMessage(err.message);
      setOpen(true);
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (!user || user.role !== 'operator') return;
    try {
      await api.delete(`/hotels/${id}`);
      fetchHotels();
      setMessage('酒店刪除成功');
      setOpen(true);
    } catch (err: any) {
      setError('無法刪除酒店');
      setMessage(err.message);
      setOpen(true);
    }
  };

  const handleFacilityChange = (event: any) => {
    setFacilities(event.target.value);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        酒店列表
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleAddHotel} style={{ marginBottom: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="位置"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="最低價格"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="最高價格"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="星級 (1-5)"
              type="number"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              inputProps={{ min: 1, max: 5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              multiple
              fullWidth
              value={facilities}
              onChange={handleFacilityChange}
              renderValue={(selected) => (
                <div>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} sx={{ m: 0.5 }} />
                  ))}
                </div>
              )}
            >
              {['WiFi', 'Pool', 'Gym', 'Parking'].map((facility) => (
                <MenuItem key={facility} value={facility}>
                  {facility}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={fetchHotels} sx={{ mr: 1 }}>
              過濾
            </Button>
            {user?.role === 'operator' && (
              <Button variant="contained" color="success" type="submit">
                添加酒店
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt={hotel.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  ${hotel.price}
                </Typography>
                <Typography variant="caption">
                  星級: {hotel.stars || 'N/A'}
                </Typography>
                <Typography variant="caption">
                  設施: {hotel.facilities?.split(',').join(', ') || 'N/A'}
                </Typography>
              </CardContent>
              {user?.role === 'operator' && (
                <CardActions>
                  <Button size="small" color="warning" onClick={() => handleUpdateHotel(hotel._id)}>
                    更新
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteHotel(hotel._id)}>
                    刪除
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>通知</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Hotels;