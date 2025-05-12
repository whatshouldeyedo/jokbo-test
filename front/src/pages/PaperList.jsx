import { useEffect, useState } from 'react';
import axios from 'axios';

function PaperList() {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/subjects').then((res) => setSubjects(res.data));
  }, []);

  const fetchPapers = async (subjectId) => {
    setSelected(subjectId);
    const res = await axios.get(`http://localhost:5000/papers/subject/${subjectId}`);
    setPapers(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>족보 보기</h2>

      <select onChange={(e) => fetchPapers(e.target.value)} defaultValue="">
        <option value="" disabled>과목 선택</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <hr />

      {papers.length === 0 && selected && <p>족보가 없습니다.</p>}

      <ul>
        {papers.map((p) => (
          <li key={p.id}>
            <a href={`http://localhost:5000/uploads/${p.filename}`} target="_blank" rel="noreferrer">
              📄 {p.description || '(설명 없음)'}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaperList;
