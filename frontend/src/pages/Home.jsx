import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import API_URL from '../api';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState({});
  const [recentMedia, setRecentMedia] = useState([]);
  const [categoryMedia, setCategoryMedia] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setContent(data.data);
      });

    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const galleryData = data.data;
          setRecentMedia(galleryData.slice(0, 3));

          // Find the latest image for each category
          const catMedia = {};
          const categories = ['performances', 'cuisine', 'art'];
          categories.forEach(cat => {
            const item = galleryData.find(img => img.category === cat);
            if (item) catMedia[cat] = item.imageUrl;
          });
          setCategoryMedia(catMedia);
        }
      });
  }, []);

  const handleHighlightClick = (routePath) => {
    navigate(`/${routePath}`);
  };

  const displayRecentMedia = [...recentMedia];
  if (content.siteLogo) {
    displayRecentMedia.unshift({
      id: 'logo-promo',
      title: 'Our Official Festival Logo',
      imageUrl: content.siteLogo
    });
  }
  return (
    <div className="home-container">
      <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${content.heroImageUrl || heroImg})` }}>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>{content.heroTitle || 'Tugyedane Kigezi Festival'}</h1>
          <p>Celebrating Identity, Strengthening Unity</p>
          <p className="hero-subtitle">{content.heroSubtitle || 'Experience the vibrant Kakitaari dance, local cuisine, and the rich heritage of the Bakiga.'}</p>
          <Link to="/about" className="btn-primary hero-btn">Join the Festival</Link>
        </motion.div>
      </section>

      <section className="highlights-section">
        <h2 className="section-title">Festival Highlights</h2>
        <div className="highlights-grid">
          <motion.div className="highlight-card" style={{ padding: categoryMedia['performances'] ? 0 : '2rem', overflow: 'hidden' }} whileHover={{ scale: 1.05 }}>
            {categoryMedia['performances'] ? (
              categoryMedia['performances'].match(/\.(mp4|mov|avi|webm)$/) || categoryMedia['performances'].includes('video/upload') ? (
                <video src={categoryMedia['performances']} autoPlay loop muted playsInline style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              ) : (
                <img src={categoryMedia['performances']} alt="Performances" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )
            ) : <div className="icon">💃</div>}
            <div style={{ padding: categoryMedia['performances'] ? '20px' : '0' }}>
              <h3>{content.highlight1Title || 'Cultural Performances'}</h3>
              <p>{content.highlight1Desc || 'Traditional music and dance including the Ekitagururo, enanga, and amadinda.'}</p>
              <motion.button
                className="btn-primary"
                style={{ marginTop: '1rem' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleHighlightClick('performances')}
              >
                View Performances
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="highlight-card" style={{ padding: categoryMedia['cuisine'] ? 0 : '2rem', overflow: 'hidden' }} whileHover={{ scale: 1.05 }}>
            {categoryMedia['cuisine'] ? (
              categoryMedia['cuisine'].match(/\.(mp4|mov|avi|webm)$/) || categoryMedia['cuisine'].includes('video/upload') ? (
                <video src={categoryMedia['cuisine']} autoPlay loop muted playsInline style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              ) : (
                <img src={categoryMedia['cuisine']} alt="Cuisine" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )
            ) : <div className="icon">🍲</div>}
            <div style={{ padding: categoryMedia['cuisine'] ? '20px' : '0' }}>
              <h3>{content.highlight2Title || 'Local Cuisine'}</h3>
              <p>{content.highlight2Desc || 'Taste authentic dishes like Empengere ,obushera,omugusha, bringing Kigezi to your plate.'}</p>
              <motion.button
                className="btn-primary"
                style={{ marginTop: '1rem' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleHighlightClick('cuisine')}
              >
                Explore Cuisine
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="highlight-card" style={{ padding: categoryMedia['art'] ? 0 : '2rem', overflow: 'hidden' }} whileHover={{ scale: 1.05 }}>
            {categoryMedia['art'] ? (
              categoryMedia['art'].match(/\.(mp4|mov|avi|webm)$/) || categoryMedia['art'].includes('video/upload') ? (
                <video src={categoryMedia['art']} autoPlay loop muted playsInline style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              ) : (
                <img src={categoryMedia['art']} alt="Art" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )
            ) : <div className="icon">🎨</div>}
            <div style={{ padding: categoryMedia['art'] ? '20px' : '0' }}>
              <h3>{content.highlight3Title || 'Art Exhibitions'}</h3>
              <p>{content.highlight3Desc || 'Discover local art, crafts, and traditional attire from talented Bakiga artists.'}</p>
              <motion.button
                className="btn-primary"
                style={{ marginTop: '1rem' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleHighlightClick('art')}
              >
                See Art
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Dynamic Section */}
      {content.customSectionTitle && content.customSectionContent && (
        <section className="highlights-section" style={{ backgroundColor: '#fff' }}>
          <h2 className="section-title">{content.customSectionTitle}</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
            <p>{content.customSectionContent}</p>
          </div>
        </section>
      )}

      {/* Recent Media Section */}
      {recentMedia.length > 0 && (
        <section className="highlights-section" style={{ paddingTop: '0' }}>
          <h2 className="section-title">Latest Updates</h2>
          <div className="highlights-grid">
            {displayRecentMedia.map((media, index) => (
              <motion.div
                key={media.id}
                className="highlight-card"
                style={{ padding: 0, overflow: 'hidden' }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleHighlightClick('gallery')}
                style={{ cursor: 'pointer' }}
              >
                {media.imageUrl.match(/\.(mp4|mov|avi|webm)$/) || media.imageUrl.includes('video/upload') ? (
                  <video src={media.imageUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                ) : (
                  <img src={media.imageUrl} alt={media.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: 0 }}>{media.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
