import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';

function Profile() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          내 정보
        </Typography>
        <Typography variant="body1">이메일: {user.email}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          이름: {user.name}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          내 동아리
        </Typography>
        {clubs.length === 0 ? (
          <Typography color="text.secondary">가입한 동아리가 없습니다.</Typography>
        ) : (
          <List>
            {clubs.map((club) => (
              <ListItem key={club.id} disablePadding>
                <ListItemText primary={club.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;
