import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) return;
    if (!['image/jpeg', 'image/png'].includes(avatar.type) || avatar.size > 2 * 1024 * 1024) {
      setError('Only JPG/PNG files under 2MB are allowed');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('Upload successful');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: user ? (error.includes('successful') ? 'green' : 'red') : 'red' }}>{error}</p>}
      {user && (
        <form onSubmit={handleUpload} style={{ maxWidth: '300px' }}>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            style={{ marginBottom: '10px' }}
          />
          <button
            type="submit"
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
          >
            Upload Avatar
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;