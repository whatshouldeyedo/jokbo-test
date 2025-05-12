import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError('사용자 정보를 불러올 수 없습니다');
      }
    };

    fetchUser();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>내 정보</h2>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
    </div>
  );
}

export default Profile;
