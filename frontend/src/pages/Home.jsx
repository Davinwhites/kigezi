import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import API_URL from '../api';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setContent(data.data);
      });
  }, []);

  const handleHighlightClick = (routePath) => {
    navigate(`/${routePath}`);
  };
  return (
    <div className="home-container">
      <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${heroImg})` }}>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>{content.heroTitle || 'Tugyedane Kigezi Festival'}</h1>
          <p>Celebrating Identity, Strengthening Unity</p>
          <p className="hero-subtitle">{content.heroSubtitle || 'Experience the vibrant Baakisimba dance, local cuisine, and the rich heritage of the Bakiga.'}</p>
          <Link to="/about" className="btn-primary hero-btn">Join the Festival</Link>
        </motion.div>
      </section>

      <section className="highlights-section">
        <h2 className="section-title">Festival Highlights</h2>
        <div className="highlights-grid">
          <motion.div className="highlight-card" whileHover={{ scale: 1.05 }}>
            <div className="icon">💃</div>
            <h3>{content.highlight1Title || 'Cultural Performances'}</h3>
            <p>{content.highlight1Desc || 'Traditional music and dance including the Ekitagururo, enanga, and amadinda.'}</p>
            <motion.button 
              className="btn-primary" 
              style={{marginTop: '1rem'}} 
              whileTap={{ scale: 0.9 }} 
              onClick={() => handleHighlightClick('performances')}
            >
              View Performances
            </motion.button>
          </motion.div>
          <motion.div className="highlight-card" whileHover={{ scale: 1.05 }}>
            <div className="icon">🍲</div>
            <h3>{content.highlight2Title || 'Local Cuisine'}</h3>
            <p>{content.highlight2Desc || 'Taste authentic dishes like Empengere and Eshabwe, bringing Kigezi to your plate.'}</p>
            <motion.button 
              className="btn-primary" 
              style={{marginTop: '1rem'}} 
              whileTap={{ scale: 0.9 }} 
              onClick={() => handleHighlightClick('cuisine')}
            >
              Explore Cuisine
            </motion.button>
          </motion.div>
          <motion.div className="highlight-card" whileHover={{ scale: 1.05 }}>
            <div className="icon">🎨</div>
            <h3>{content.highlight3Title || 'Art Exhibitions'}</h3>
            <p>{content.highlight3Desc || 'Discover local art, crafts, and traditional attire from talented Bakiga artists.'}</p>
            <motion.button 
              className="btn-primary" 
              style={{marginTop: '1rem'}} 
              whileTap={{ scale: 0.9 }} 
              onClick={() => handleHighlightClick('art')}
            >
              See Art
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
