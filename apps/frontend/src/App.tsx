import { Routes, Route, Navigate } from 'react-router-dom';
import CreateVideo from './pages/CreateVideo';
import Videos from './pages/Videos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/videos" replace />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/create-video" element={<CreateVideo />} />
    </Routes>
  );
}

export default App;
