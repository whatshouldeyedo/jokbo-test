import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Paper, Typography } from '@mui/material';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');

  const validate = () => {
    if (form.email.length == 0) {
      setStatus('이메일을 입력하세요.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('올바른 이메일을 입력하세요.');
      return false;
    }
    if (form.password.length == 0) {
      setStatus('비밀번호를 입력하세요.');
      return false;
    }
    return true;
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post('http://localhost:5000/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setStatus('로그인 성공');
    } catch (err) {
      setStatus(err.response.data.message || '로그인 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Paper elevation={3} style={{ padding: 32, maxWidth: 400, margin: 'auto' }}>
        <Typography variant="h5" gutterBottom>로그인</Typography>
        <TextField 
          label="이메일" 
          fullWidth 
          margin="normal" 
          name="email"
          onChange={handleChange}
        />
        <TextField 
          label="비밀번호" 
          type="password" 
          fullWidth 
          margin="normal" 
          name="password"
          onChange={handleChange}
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleLogin}
        >
          로그인
        </Button>
        <p>{status}</p>
      </Paper>
    </div>
  );
}

export default Login;
