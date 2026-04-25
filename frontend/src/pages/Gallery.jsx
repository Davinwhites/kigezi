import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteLogo, setSiteLogo] = useState(null);

  useEffect(() => {
    // Fetch Logo
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => data.success && setSiteLogo(data.data.siteLogo));

    setLoading(true);
    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          let fetchedImages = data.data;
          
          // Prepend logo
          if (siteLogo) {
            fetchedImages = [{
              id: 'logo-item',
              title: 'Official Festival Logo',
              imageUrl: siteLogo,
              category: 'general'
            }, ...fetchedImages];
          }

          setImages(fetchedImages);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteLogo]);

  return (
    <div className="gallery-container">
      <BackButton />
      <h1 className="section-title">Festival Gallery</h1>
      <p className="text-center subtitle">Relive the moments and vibrant colors of the Tugyedane Kigezi Festival.</p>
      
      {loading ? (
        <p className="text-center">Loading gallery...</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, index) => (
            <motion.div 
              key={img.id} 
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              {img.imageUrl.match(/\.(mp4|mov|avi|webm)$/) || img.imageUrl.includes('video/upload') ? (
                <video src={img.imageUrl} controls className="gallery-video" />
              ) : (
                <img src={img.imageUrl} alt={img.title} />
              )}
              <div className="gallery-overlay">
                <span>{img.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {!loading && images.length === 0 && <p className="text-center">No items found in this category.</p>}
    </div>
  );
};

export default Gallery;
