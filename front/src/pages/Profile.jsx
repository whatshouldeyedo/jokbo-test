import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [userRes, clubsRes] = await Promise.all([
          axios.get('http://localhost:5000/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/clubs/mine', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setClubs(clubsRes.data);
      } catch (err) {
        setError('사용자 정보를 불러올 수 없습니다');
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>내 정보</h2>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>

      <h3 style={{ marginTop: 30 }}>내 동아리</h3>
      {clubs.length === 0 ? (
        <p>가입한 동아리가 없습니다.</p>
      ) : (
        <ul>
          {clubs.map((club) => (
            <li key={club.id}>{club.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
