// Components (import shared layout components here as you build them, e.g. NavBar/Footer)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Styles
import '../src/App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Add your page routes here, e.g.:
        <Route path="/" element={<HomePage />} /> */}
        <Route path="*" element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
