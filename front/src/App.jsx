import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import UploadPaper from './pages/UploadPaper';
import PaperList from './pages/PaperList';
import ClubManager from './pages/ManageClub';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link> | <Link to="/profile">내 정보</Link> | <Link to="/clubs">동아리 관리</Link> | <Link to="/upload">족보 업로드</Link> | <Link to="/papers">족보 보기</Link> 
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clubs" element={<ClubManager />} />
        <Route path="/upload" element={<UploadPaper />} />
        <Route path="/papers" element={<PaperList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
