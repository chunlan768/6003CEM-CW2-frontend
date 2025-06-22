import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Container, Typography, Alert, MenuItem, FormControl, InputLabel, Select, CircularProgress,
} from '@mui/material';

interface RegisterFormValues {
  email: string;
  password: string;
  role: string;
  signupCode: string;
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('無效的電子郵件格式').required('電子郵件為必填項'),
    password: Yup.string().min(6, '密碼必須至少 6 個字符').required('密碼為必填項'),
    role: Yup.string().oneOf(['user', 'operator'], '請選擇有效的角色').required('角色為必填項'),
    signupCode: Yup.string().when('role', {
      is: 'operator',
      then: (schema) => schema.required('註冊碼為必填項').oneOf(['wanderlust2023'], '註冊碼必須為 "wanderlust2023"'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <Container maxWidth="xs" sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" align="center" gutterBottom>註冊</Typography>
      <Formik
        initialValues={{ email: '', password: '', role: '', signupCode: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values: RegisterFormValues, { setSubmitting, setFieldError }: FormikHelpers<RegisterFormValues>) => {
          setSubmitting(true);
          try {
            await register(values.email, values.password, values.role, values.role === 'operator' ? values.signupCode : undefined);
            navigate('/login');
          } catch (err: any) {
            console.error('註冊錯誤:', {
              message: err.message,
              response: err.response ? err.response.data : 'No response',
              status: err.response?.status,
            });
            setFieldError('email', err.response?.data?.message || '註冊失敗，請重試');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }: FormikProps<RegisterFormValues>) => (
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
              label="密碼"
              type="password"
              name="password"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              required
            />
            <FormControl fullWidth margin="normal" required error={touched.role && !!errors.role}>
              <InputLabel>角色</InputLabel>
              <Select
                name="role"
                value={values.role}
                onChange={(e) => setFieldValue('role', e.target.value)}
                label="角色"
              >
                <MenuItem value="user">用戶</MenuItem>
                <MenuItem value="operator">操作員</MenuItem>
              </Select>
              {touched.role && errors.role && <Typography color="error">{errors.role}</Typography>}
            </FormControl>
            {values.role === 'operator' && (
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="註冊碼"
                name="signupCode"
                error={touched.signupCode && !!errors.signupCode}
                helperText={touched.signupCode && errors.signupCode}
                required
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? '註冊中...' : '註冊'}
            </Button>
            {errors.email && !isSubmitting && <Alert severity="error" sx={{ mt: 2 }}>{errors.email}</Alert>}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;