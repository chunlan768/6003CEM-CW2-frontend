import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Hotel } from '../types/Hotel';

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchHotels();
  }, [location, minPrice, maxPrice]);

  const fetchHotels = async () => {
    const params = { location, minPrice, maxPrice };
    const response = await api.get<Hotel[]>('/hotels', { params });
    setHotels(response.data);
  };

  return (
    <div>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" />
      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" />
      <button onClick={fetchHotels}>Filter</button>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel._id}>{hotel.name} - {hotel.location} - ${hotel.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default Hotels;