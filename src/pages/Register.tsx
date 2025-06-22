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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';

interface RegisterFormValues {
  email: string;
  password: string;
  role: string; // 確保 role 是字符串
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
      is: 'operator', // 使用字符串直接比較
      then: (schema) => schema.required('註冊碼為必填項').oneOf(['wanderlust2023'], '無效的註冊碼'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <Container maxWidth="xs" sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" align="center" gutterBottom>
        註冊
      </Typography>
      <Formik
        initialValues={{ email: '', password: '', role: '', signupCode: '' }} // 確保 role 初始為空字符串
        validationSchema={validationSchema}
        onSubmit={async (values: RegisterFormValues, { setSubmitting, setErrors }: FormikHelpers<RegisterFormValues>) => {
          setSubmitting(true);
          try {
            await register(values.email, values.password, values.role, values.signupCode);
            navigate('/login');
          } catch (err: any) {
            console.error('註冊錯誤:', err.response || err);
            const errorMessage = err.response?.data?.message || `註冊失敗，狀態碼: ${err.response?.status || '未知'}。請檢查後端服務。`;
            setErrors({ email: errorMessage });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, values }: FormikProps<RegisterFormValues>) => (
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
            <FormControl fullWidth margin="normal" required error={touched.role && !!errors.role}>
              <InputLabel>角色</InputLabel>
              <Field
                as={Select}
                name="role"
                label="角色"
                aria-label="角色選擇框"
              >
                <MenuItem value="user">用戶</MenuItem>
                <MenuItem value="operator">操作員</MenuItem>
              </Field>
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
                aria-label="註冊碼輸入框"
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