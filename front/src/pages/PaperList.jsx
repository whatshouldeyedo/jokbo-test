import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';

function PaperList() {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    axios.get('https://sori.newbie.sparcs.me/subjects').then((res) => setSubjects(res.data));
  }, []);

  const fetchPapers = async (subjectId) => {
    setSelected(subjectId);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`https://sori.newbie.sparcs.me/papers/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers(res.data);
    } catch (err) {
      alert('족보를 불러오는 데 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          족보 보기
        </Typography>

        <Select
          value={selected}
          onChange={(e) => fetchPapers(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            과목 선택
          </MenuItem>
          {subjects.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>

        <Divider sx={{ my: 2 }} />

        {papers.length === 0 && selected && (
          <Typography color="text.secondary">족보가 없습니다.</Typography>
        )}

        <List>
          {papers.map((p) => (
            <ListItem key={p.id} disablePadding sx={{ mb: 1 }}>
              <ListItemText
                primary={
                  <Box>
                    <a
                      href={`https://sori.newbie.sparcs.me/uploads/${p.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                    >
                      📄 {p.description || '(설명 없음)'}
                    </a>
                    {p.Club ? (
                      <Chip
                        label={`${p.Club.name} 전용`}
                        size="small"
                        color="secondary"
                        sx={{ ml: 1 }}
                      />
                    ) : (
                      <Chip
                        label="전체 공개"
                        size="small"
                        sx={{ ml: 1, bgcolor: '#eee', color: '#555' }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default PaperList;
