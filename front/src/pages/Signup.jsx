import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Paper, Typography } from '@mui/material';

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/auth/signup', form);
      setStatus('회원가입 성공');
    } catch (err) {
      setStatus(err.response.data.message || '회원가입 실패');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 32, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>회원가입</Typography>
      <TextField label="이메일" name="email" onChange={handleChange} fullWidth margin="normal" />
      <TextField label="이름" name="name" onChange={handleChange} fullWidth margin="normal" />
      <TextField label="비밀번호" name="password" type="password" onChange={handleChange} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSignup} fullWidth>가입하기</Button>
      <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 16 }}>
        {status}
      </Typography>
    </Paper>
  );
}

export default Signup;
