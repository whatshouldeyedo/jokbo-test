import { useEffect, useState } from 'react';
import axios from 'axios';

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
        axios.get('http://localhost:5000/subjects'),
        axios.get('http://localhost:5000/clubs/mine', {
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
      await axios.post('http://localhost:5000/papers/upload', formData, {
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
    <div style={{ padding: 20 }}>
      <h2>족보 업로드</h2>

      <label>과목 선택: </label>
      <select onChange={(e) => setSelectedSubject(e.target.value)} defaultValue="">
        <option value="" disabled>과목을 선택하세요</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>{subject.name}</option>
        ))}
      </select>
      <br /><br />

      <label>공개 대상 (선택): </label>
      <select onChange={(e) => setSelectedClub(e.target.value)} defaultValue="">
        <option value="">전체 공개</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>{club.name}</option>
        ))}
      </select>
      <br /><br />

      <label>설명:</label><br />
      <textarea rows="3" onChange={(e) => setDescription(e.target.value)} />
      <br /><br />

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>업로드</button>

      <p>{status}</p>
    </div>
  );
}

export default UploadPaper;
