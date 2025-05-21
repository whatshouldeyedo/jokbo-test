import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Paper, Typography } from '@mui/material';

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      setStatus('올바른 이메일을 입력하세요.');
      return false;
    }
    if (
      form.password.length < 8 ||
      form.password.length > 32 ||
      !/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(form.password)
    ) {
      setStatus('비밀번호는 8~32자, 영문/숫자/특수문자만 가능합니다.');
      return false;
    }
    if (
      form.name.length < 2 ||
      form.name.length > 20 ||
      !/^[가-힣a-zA-Z0-9]+$/.test(form.name)
    ) {
      setStatus('이름은 2~20자, 한글/영문/숫자만 가능합니다.');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      await axios.post('http://localhost:5000/auth/signup', form);
      setStatus('회원가입 성공');
      setTimeout(() => navigate('/login'), 1000);
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
