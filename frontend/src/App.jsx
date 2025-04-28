import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import LangingPage from './pages/LangingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<LangingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
