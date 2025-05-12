import { useEffect, useState } from 'react';
import axios from 'axios';

function UploadPaper() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  // 과목 리스트 불러오기
  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await axios.get('http://localhost:5000/subjects');
      setSubjects(res.data);
    };
    fetchSubjects();
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
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
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
