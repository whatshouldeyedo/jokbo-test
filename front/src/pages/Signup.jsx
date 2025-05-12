import { useState } from 'react';
import axios from 'axios';

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
    <div style={{ padding: 20 }}>
      <h2>회원가입</h2>
      <input name="email" placeholder="이메일" onChange={handleChange} /><br />
      <input name="name" placeholder="이름" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} /><br />
      <button onClick={handleSignup}>가입하기</button>
      <p>{status}</p>
    </div>
  );
}

export default Signup;
