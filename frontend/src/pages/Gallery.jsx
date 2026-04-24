import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          let fetchedImages = data.data;
          if (categoryFilter) {
            fetchedImages = fetchedImages.filter(img => img.category === categoryFilter);
          }
          setImages(fetchedImages);
        }
      });
  }, [categoryFilter]);

  return (
    <div className="gallery-container">
      <BackButton />
      <h1 className="section-title">Festival Gallery</h1>
      <p className="text-center subtitle">Relive the moments and vibrant colors of the Tugyedane Kigezi Festival.</p>
      
      <div className="gallery-tabs" style={{display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap'}}>
        {['all', 'performances', 'cuisine', 'art', 'general'].map(cat => (
          <button 
            key={cat}
            onClick={() => {
              if (cat === 'all') {
                window.history.pushState({}, '', '/gallery');
                // Re-fetch all
                fetch(`${API_URL}/api/gallery`)
                  .then(res => res.json())
                  .then(data => data.success && setImages(data.data));
              } else {
                window.history.pushState({}, '', `/gallery?category=${cat}`);
                // Re-fetch filtered
                fetch(`${API_URL}/api/gallery`)
                  .then(res => res.json())
                  .then(data => {
                    if(data.success) setImages(data.data.filter(img => img.category === cat));
                  });
              }
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: (categoryFilter === cat || (!categoryFilter && cat === 'all')) ? '#ff8f00' : '#eee',
              color: (categoryFilter === cat || (!categoryFilter && cat === 'all')) ? 'white' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 'bold'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="gallery-grid">
        {images.map((img, index) => (
          <motion.div 
            key={img.id} 
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
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
    </div>
  );
};

export default Gallery;
