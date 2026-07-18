import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Styles
import '../src/App.css';
//Page Imports
import LoginPage from './pages/LoginPage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import ClassListPage from './pages/ClassListPage';
function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/classes" element={<ClassListPage/>}/>
        <Route path="*" element={<Navigate to='/' replace />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App;
