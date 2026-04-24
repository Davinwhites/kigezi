import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Performances from './pages/Performances';
import Cuisine from './pages/Cuisine';
import Art from './pages/Art';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/performances" element={<Performances />} />
            <Route path="/cuisine" element={<Cuisine />} />
            <Route path="/art" element={<Art />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
