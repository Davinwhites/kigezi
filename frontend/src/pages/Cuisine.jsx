import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import '../pages/Gallery.css';

const Cuisine = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setImages(data.data.filter(img => img.category === 'cuisine'));
        }
      });
  }, []);

  return (
    <div className="gallery-container">
      <BackButton />
      <h1 className="section-title">Local Cuisine</h1>
      <p className="text-center subtitle">Taste authentic dishes like Empengere and Eshabwe, bringing Kigezi to your plate.</p>
      
      <div className="gallery-grid">
        {images.map((img, index) => (
          <motion.div 
            key={img.id} 
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {img.imageUrl.match(/\.(mp4|mov|avi|webm)$/) || img.imageUrl.includes('video/upload') ? (
              <video src={img.imageUrl} controls className="gallery-video" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <img src={img.imageUrl} alt={img.title} />
            )}
            <div className="gallery-overlay">
              <h3>{img.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center">No images uploaded for cuisine yet.</p>}
    </div>
  );
};

export default Cuisine;
