import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import About from './pages/About';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Navbar/>

      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
