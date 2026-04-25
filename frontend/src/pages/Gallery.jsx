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
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category') || 'all';

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
          if (categoryFilter !== 'all') {
            fetchedImages = fetchedImages.filter(img => img.category === categoryFilter);
          }
          
          // Prepend logo if general or all
          if (siteLogo && (categoryFilter === 'all' || categoryFilter === 'general')) {
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
  }, [categoryFilter, siteLogo]);

  const handleTabClick = (cat) => {
    if (cat === 'all') {
      navigate('/gallery');
    } else {
      navigate(`/gallery?category=${cat}`);
    }
  };

  return (
    <div className="gallery-container">
      <BackButton />
      <h1 className="section-title">Festival Gallery</h1>
      <p className="text-center subtitle">Relive the moments and vibrant colors of the Tugyedane Kigezi Festival.</p>
      
      <div className="gallery-tabs" style={{display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap'}}>
        {['all', 'performances', 'cuisine', 'art', 'general'].map(cat => (
          <button 
            key={cat}
            onClick={() => handleTabClick(cat)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: categoryFilter === cat ? '#ff8f00' : '#eee',
              color: categoryFilter === cat ? 'white' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      
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
