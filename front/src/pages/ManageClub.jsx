import { useEffect, useState } from 'react';
import axios from 'axios';

function ClubManager() {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState('');
  const [inviteEmails, setInviteEmails] = useState({});
  const [status, setStatus] = useState('');

  const token = localStorage.getItem('token');

  const fetchClubs = async () => {
    const res = await axios.get('http://localhost:5000/clubs/mine', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClubs(res.data);
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateClub = async () => {
    if (!newClubName) return;
    try {
      await axios.post(
        'http://localhost:5000/clubs',
        { name: newClubName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('동아리 생성 완료');
      setNewClubName('');
      fetchClubs();
    } catch (err) {
      setStatus('생성 실패: ' + (err.response?.data?.message || '에러'));
    }
  };

  const handleInvite = async (clubId) => {
    const email = inviteEmails[clubId];
    if (!email) return;
    try {
      await axios.post(
        `http://localhost:5000/clubs/${clubId}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`${email} 초대 성공`);
      setInviteEmails((prev) => ({ ...prev, [clubId]: '' }));
    } catch (err) {
      setStatus(`초대 실패: ${err.response?.data?.message || '에러'}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>동아리 관리</h2>

      <h3>동아리 개설</h3>
      <input
        type="text"
        placeholder="동아리 이름"
        value={newClubName}
        onChange={(e) => setNewClubName(e.target.value)}
      />
      <button onClick={handleCreateClub} style={{ marginLeft: 8 }}>
        개설
      </button>

      <h3 style={{ marginTop: 30 }}>내 동아리</h3>
      {clubs.length === 0 ? (
        <p>아직 동아리가 없습니다.</p>
      ) : (
        <ul>
          {clubs.map((club) => (
            <li key={club.id}>
              <strong>{club.name}</strong>
              <div style={{ marginTop: 5, marginBottom: 15 }}>
                <input
                  type="email"
                  placeholder="초대할 이메일"
                  value={inviteEmails[club.id] || ''}
                  onChange={(e) =>
                    setInviteEmails((prev) => ({
                      ...prev,
                      [club.id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleInvite(club.id)} style={{ marginLeft: 5 }}>
                  초대
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {status && <p style={{ marginTop: 15 }}>{status}</p>}
    </div>
  );
}

export default ClubManager;
