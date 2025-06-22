import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('public');
  const [signupCode, setSignupCode] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, role, signupCode);
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="public">Public</option>
        <option value="operator">Operator</option>
      </select>
      <input type="text" value={signupCode} onChange={(e) => setSignupCode(e.target.value)} placeholder="Signup Code" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;