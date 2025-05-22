import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Alert,
  Box,
} from '@mui/material';

function UploadPaper() {
  const [subjects, setSubjects] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const [subjectRes, clubRes] = await Promise.all([
        axios.get('https://sori.newbie.sparcs.me/subjects'),
        axios.get('https://sori.newbie.sparcs.me/clubs/mine', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSubjects(subjectRes.data);
      setClubs(clubRes.data);
    };

    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedSubject) {
      setStatus('과목과 파일을 선택하세요.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', selectedSubject);
    formData.append('description', description);
    if (selectedClub) {
      formData.append('clubId', selectedClub);
    }

    try {
      await axios.post('https://sori.newbie.sparcs.me/papers/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('업로드 성공!');
    } catch (err) {
      setStatus('업로드 실패: ' + (err.response?.data?.message || '에러'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          족보 업로드
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="subject-label">과목 선택</InputLabel>
          <Select
            labelId="subject-label"
            value={selectedSubject}
            label="과목 선택"
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <MenuItem value="" disabled>
              과목을 선택하세요
            </MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="club-label">공개 대상 (선택)</InputLabel>
          <Select
            labelId="club-label"
            value={selectedClub}
            label="공개 대상 (선택)"
            onChange={(e) => setSelectedClub(e.target.value)}
          >
            <MenuItem value="">전체 공개</MenuItem>
            {clubs.map((club) => (
              <MenuItem key={club.id} value={club.id}>
                {club.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="설명 (선택, 50자 이내)"
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            파일 선택 (PDF)
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
              {file.name}
            </Typography>
          )}
        </Box>

        <Button variant="contained" color="primary" fullWidth onClick={handleUpload}>
          업로드
        </Button>

        {status && (
          <Alert severity={status.includes('성공') ? 'success' : 'error'} sx={{ mt: 3 }}>
            {status}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default UploadPaper;
