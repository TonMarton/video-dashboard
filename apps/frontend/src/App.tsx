import { Routes, Route } from 'react-router-dom';
import CreateVideo from './pages/CreateVideo';

function App() {
  return (
    <Routes>
      <Route path="/create-video" element={<CreateVideo />} />
    </Routes>
  );
}

export default App;
