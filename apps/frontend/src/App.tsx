import { Routes, Route, Navigate } from 'react-router-dom';
import CreateVideo from './pages/CreateVideo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-video" replace />} />
      <Route path="/create-video" element={<CreateVideo />} />
    </Routes>
  );
}

export default App;
