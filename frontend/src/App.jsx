import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-800 bg-gradient-to-tl from-green-500 to-transparent flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
