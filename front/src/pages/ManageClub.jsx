import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Alert,
  Stack,
} from '@mui/material';

function ManageClub() {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState('');
  const [inviteEmails, setInviteEmails] = useState({});
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');

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
    if (!newClubName) {
      setStatus('동아리 이름을 입력하세요.');
      setStatusType('error');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/clubs',
        { name: newClubName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('동아리 생성 완료');
      setStatusType('success');
      setNewClubName('');
      fetchClubs();
    } catch (err) {
      setStatus('생성 실패: ' + (err.response?.data?.message || '에러'));
      setStatusType('error');
    }
  };

  const handleInvite = async (clubId) => {
    const email = inviteEmails[clubId];
    if (!email) {
      setStatus('초대할 이메일을 입력하세요.');
      setStatusType('error');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/clubs/${clubId}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`${email} 초대 성공`);
      setStatusType('success');
      setInviteEmails((prev) => ({ ...prev, [clubId]: '' }));
    } catch (err) {
      setStatus(`초대 실패: ${err.response?.data?.message || '에러'}`);
      setStatusType('error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          동아리 관리
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          동아리 개설
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="동아리 이름"
            value={newClubName}
            onChange={(e) => setNewClubName(e.target.value)}
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={handleCreateClub}>
            개설
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          내 동아리
        </Typography>
        {clubs.length === 0 ? (
          <Typography color="text.secondary">아직 동아리가 없습니다.</Typography>
        ) : (
          <List>
            {clubs.map((club) => (
              <Paper key={club.id} sx={{ mb: 2, p: 2 }}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight="bold">{club.name}</Typography>}
                  />
                </ListItem>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    label="초대할 이메일"
                    type="email"
                    size="small"
                    value={inviteEmails[club.id] || ''}
                    onChange={(e) =>
                      setInviteEmails((prev) => ({
                        ...prev,
                        [club.id]: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleInvite(club.id)}
                  >
                    초대
                  </Button>
                </Stack>
              </Paper>
            ))}
          </List>
        )}

        {status && (
          <Alert severity={statusType} sx={{ mt: 3 }}>
            {status}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default ManageClub;
