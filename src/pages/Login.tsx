import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('無效的電子郵件格式').required('電子郵件為必填項'),
    password: Yup.string().min(6, '密碼必須至少 6 個字符').required('密碼為必填項'),
  });

  return (
    <Container maxWidth="xs" sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" align="center" gutterBottom>
        登錄
      </Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values: LoginFormValues, { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>) => {
          setSubmitting(true);
          try {
            await login(values.email, values.password);
            navigate('/hotels');
          } catch (err: any) {
            console.error('登錄錯誤:', err.response || err);
            const errorMessage = err.response?.data?.message || '登錄失敗，請重試';
            setErrors({ email: errorMessage });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }: FormikProps<LoginFormValues>) => (
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
              aria-label="電子郵件輸入框"
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="密碼"
              type="password"
              name="password"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              required
              aria-label="密碼輸入框"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? '登錄中...' : '登錄'}
            </Button>
            {errors.email && !isSubmitting && <Alert severity="error" sx={{ mt: 2 }}>{errors.email}</Alert>}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;