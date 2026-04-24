import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import newsImg from '../assets/news-image.jpg';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import './About.css';

const About = () => {
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setContent(data.data);
      });

    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setNews(data.data);
      });
  }, []);
  return (
    <div className="about-container">
      <BackButton />
      <section className="about-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title"
        >
          About Tugyedane Kigezi
        </motion.h1>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Our Purpose</h2>
            <p style={{ whiteSpace: 'pre-line' }}>
              {content.aboutText || "Tugyedane Kigezi Festival, under the theme 'Celebrating Identity, Strengthening Unity', emphasizes cultural preservation, community unity, and socioeconomic empowerment."}
            </p>
          </motion.div>
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Event Overview</h2>
            <ul className="overview-list">
              {(content.eventOverview || 'Performances: Traditional music and dance, such as the Ekitagururo, the enanga, and amadinda.\nArt Exhibitions: Displays of local art, crafts, and traditional attire, providing a platform for Bakiga artists.\nFood and Cuisine: Authentic local Kiga food like Empengere and Eshabwe.\nNetworking Opportunities: Spaces to connect, share experiences, and build relationships within the Bakiga diaspora.')
                .split('\n')
                .filter(item => item.trim() !== '')
                .map((item, i) => (
                  <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-4"><strong>Location:</strong> {content.location || 'Mbarara City'}</p>
          </motion.div>
        </div>
      </section>

      <section className="news-section">
        <h2 className="section-title">Latest News & Updates</h2>
        <div className="news-container">
          {news.length === 0 ? (
            <p className="text-center">No news updates available at the moment.</p>
          ) : (
            news.map(n => (
              <div key={n.id} className="news-card" style={{ marginBottom: '2rem' }}>
                <img src={n.imageUrl || newsImg} alt={n.title} className="news-image" />
                <div className="news-content">
                  <h3>{n.title}</h3>
                  <p className="news-date">{n.date}</p>
                  <p style={{ whiteSpace: 'pre-line' }}>{n.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
