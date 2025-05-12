import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
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
      <h2>로그인</h2>
      <input name="email" placeholder="이메일" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} /><br />
      <button onClick={handleLogin}>로그인</button>
      <p>{status}</p>
    </div>
  );
}

export default Login;
