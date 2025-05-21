import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import UploadPaper from './pages/UploadPaper';
import PaperList from './pages/PaperList';
import ClubManager from './pages/ManageClub';

import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Typography,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static" color="primary">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/logo.png"
                alt="Jokbo Logo"
                style={{ height: 40, marginRight: 16 }}
              />
            </Box>
            {}
            <Box>
              <Button color="inherit" component={Link} to="/login">
                로그인
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                회원가입
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                내 정보
              </Button>
              <Button color="inherit" component={Link} to="/clubs">
                동아리 관리
              </Button>
              <Button color="inherit" component={Link} to="/upload">
                족보 업로드
              </Button>
              <Button color="inherit" component={Link} to="/papers">
                족보 보기
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        {}
        <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa', py: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/clubs" element={<ClubManager />} />
            <Route path="/upload" element={<UploadPaper />} />
            <Route path="/papers" element={<PaperList />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
