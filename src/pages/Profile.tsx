import React, { useState } from 'react';
import api from '../services/api';

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatar) return;
    const formData = new FormData();
    formData.append('avatar', avatar);
    const response = await api.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Upload response:', response.data);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
      <button type="submit">Upload Avatar</button>
    </form>
  );
};

export default Profile;