import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Styles
import '../src/App.css';
//Page Imports
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to='/' replace />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App;
