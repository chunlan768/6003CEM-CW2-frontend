// src/pages/Profile.tsx
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Typography, CircularProgress, Alert, Container, Box, TextField } from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface ProfileFormValues {
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

// src/pages/Profile.tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('僅支持 JPG 和 PNG 格式');
      return;
    }
    if (selectedFile.size > 1024 * 1024) {
      setError('文件大小不得超過 1MB');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }
};

const handleUpload = async () => {
  if (!file) return;
  setUploading(true);
  setError(null);
  const formData = new FormData();
  formData.append('avatar', file); // 更改為 'avatar'
  try {
    const response = await api.post('/auth/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setSuccess('頭像上傳成功！');
    setTimeout(() => setSuccess(null), 3000);
  } catch (err: any) {
    setError('上傳失敗: ' + (err.response?.data?.message || err.message));
  } finally {
    setUploading(false);
  }
};

  const validationSchema = Yup.object({
    email: Yup.string().email('無效的電子郵件格式').required('電子郵件為必填項'),
    password: Yup.string().min(6, '密碼必須至少 6 個字符').required('密碼為必填項'),
  });

  const handleUpdateProfile = async (values: ProfileFormValues, { setSubmitting }: FormikHelpers<ProfileFormValues>) => {
    setSubmitting(true);
    try {
      await api.put('/auth/profile', values);
      setSuccess('個人資料更新成功！');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('更新失敗: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" align="center">個人資料</Typography>
      <Typography>用戶: {user?.email}</Typography>
      {preview && <Box sx={{ mt: 2 }}><img src={preview} alt="Preview" style={{ maxWidth: '200px' }} /></Box>}
      <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} style={{ marginTop: '10px' }} />
      <Button variant="contained" onClick={handleUpload} disabled={uploading || !file} sx={{ mt: 2, mb: 2 }}>
        {uploading ? <CircularProgress size={24} /> : '上傳頭像'}
      </Button>
      <Formik
        initialValues={{ email: user?.email || '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleUpdateProfile}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="電子郵件"
              name="email"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              required
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="新密碼"
              type="password"
              name="password"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }} disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} /> : '更新資料'}
            </Button>
          </Form>
        )}
      </Formik>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>登出</Button>
    </Container>
  );
};

export default Profile;