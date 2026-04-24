import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Data States
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Forms
  const [newsForm, setNewsForm] = useState({ title: '', content: '', imageFile: null });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'general', imageFile: null });

  const fetchData = async () => {
    try {
      const [contentRes, newsRes, galleryRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/content`),
        fetch(`${API_URL}/api/news`),
        fetch(`${API_URL}/api/gallery`),
        fetch(`${API_URL}/api/contact`)
      ]);

      const contentData = await contentRes.json();
      const newsData = await newsRes.json();
      const galleryData = await galleryRes.json();
      const contactsData = await contactsRes.json();

      setContent(contentData.data || {});
      setNews(newsData.data || []);
      setGallery(galleryData.data || []);
      setContacts(contactsData.data || []);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.toLowerCase().trim() === 'tugyendane' && loginForm.password === 'kigezi@2026') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Credentials');
    }
  };

  const handleContentChange = (key, value) => {
    setContent({ ...content, [key]: value });
  };

  const saveContent = async () => {
    await fetch(`${API_URL}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });
    alert('Content Saved Successfully!');
  };

  const addNews = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newsForm.title);
    formData.append('content', newsForm.content);
    if (newsForm.imageFile) formData.append('image', newsForm.imageFile);

    await fetch(`${API_URL}/api/news`, {
      method: 'POST',
      body: formData
    });
    setNewsForm({ title: '', content: '', imageFile: null });
    document.getElementById('newsFileInput').value = '';
    fetchData();
  };

  const deleteNews = async (id) => {
    await fetch(`${API_URL}/api/news/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addGallery = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('category', galleryForm.category);
    if (galleryForm.imageFile) formData.append('image', galleryForm.imageFile);

    await fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      body: formData
    });
    setGalleryForm({ title: '', category: 'general', imageFile: null });
    document.getElementById('galleryFileInput').value = '';
    fetchData();
  };

  const deleteGallery = async (id) => {
    await fetch(`${API_URL}/api/gallery/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div style={{position: 'absolute', top: '100px', left: '20px'}}>
          <BackButton />
        </div>
        <motion.form 
          className="admin-login-form" 
          onSubmit={handleLogin}
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
        >
          <h2>Admin Login</h2>
          <input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
          <motion.button 
            type="submit" 
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <BackButton />
      <h1>Admin Dashboard</h1>
      <button className="btn-primary" onClick={saveContent} style={{marginBottom: '20px'}}>Save All Content Changes</button>

      <section className="admin-section">
        <h2>Site Text Content</h2>
        <div className="form-group">
          <label>Hero Title</label>
          <input type="text" value={content.heroTitle || ''} onChange={e => handleContentChange('heroTitle', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Hero Background Image (URL)</label>
          <input type="text" value={content.heroImageUrl || ''} onChange={e => handleContentChange('heroImageUrl', e.target.value)} placeholder="Paste any image link here..." />
        </div>
        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea value={content.heroSubtitle || ''} onChange={e => handleContentChange('heroSubtitle', e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label>About Text</label>
          <textarea value={content.aboutText || ''} onChange={e => handleContentChange('aboutText', e.target.value)} rows="4"></textarea>
        </div>
        <div className="form-group">
          <label>Event Overview List (one item per line)</label>
          <textarea value={content.eventOverview || 'Performances: Traditional music and dance, such as the Ekitagururo, the enanga, and amadinda.\nArt Exhibitions: Displays of local art, crafts, and traditional attire, providing a platform for Bakiga artists.\nFood and Cuisine: Authentic local Kiga food like Empengere and Eshabwe.\nNetworking Opportunities: Spaces to connect, share experiences, and build relationships within the Bakiga diaspora.'} onChange={e => handleContentChange('eventOverview', e.target.value)} rows="5"></textarea>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" value={content.location || 'Mbarara City'} onChange={e => handleContentChange('location', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input type="email" value={content.contactEmail || 'info@tugyedanekigezi.com'} onChange={e => handleContentChange('contactEmail', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input type="text" value={content.contactPhone || '+256 700 000 000'} onChange={e => handleContentChange('contactPhone', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Office Address</label>
          <input type="text" value={content.address || 'Mbarara City, Kigezi Region, Uganda'} onChange={e => handleContentChange('address', e.target.value)} />
        </div>
      </section>

      <section className="admin-section">
        <h2>Home Page Highlights</h2>
        <div className="form-group">
          <label>Highlight 1 Title (e.g. Performances)</label>
          <input type="text" value={content.highlight1Title || 'Cultural Performances'} onChange={e => handleContentChange('highlight1Title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Highlight 1 Description</label>
          <textarea value={content.highlight1Desc || 'Traditional music and dance including the Ekitagururo, enanga, and amadinda.'} onChange={e => handleContentChange('highlight1Desc', e.target.value)} rows="2"></textarea>
        </div>
        
        <div className="form-group">
          <label>Highlight 2 Title (e.g. Cuisine)</label>
          <input type="text" value={content.highlight2Title || 'Local Cuisine'} onChange={e => handleContentChange('highlight2Title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Highlight 2 Description</label>
          <textarea value={content.highlight2Desc || 'Taste authentic dishes like Empengere and Eshabwe, bringing Kigezi to your plate.'} onChange={e => handleContentChange('highlight2Desc', e.target.value)} rows="2"></textarea>
        </div>

        <div className="form-group">
          <label>Highlight 3 Title (e.g. Art)</label>
          <input type="text" value={content.highlight3Title || 'Art Exhibitions'} onChange={e => handleContentChange('highlight3Title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Highlight 3 Description</label>
          <textarea value={content.highlight3Desc || 'Discover local art, crafts, and traditional attire from talented Bakiga artists.'} onChange={e => handleContentChange('highlight3Desc', e.target.value)} rows="2"></textarea>
        </div>
      </section>

      <section className="admin-section">
        <h2>Custom Dynamic Section (Home Page)</h2>
        <p style={{fontSize: '14px', color: '#666', marginBottom: '15px'}}>Fill these out to instantly add a brand new section to the Home Page.</p>
        <div className="form-group">
          <label>Custom Section Title</label>
          <input type="text" value={content.customSectionTitle || ''} onChange={e => handleContentChange('customSectionTitle', e.target.value)} placeholder="e.g. Special Announcements" />
        </div>
        <div className="form-group">
          <label>Custom Section Content</label>
          <textarea value={content.customSectionContent || ''} onChange={e => handleContentChange('customSectionContent', e.target.value)} rows="4" placeholder="Enter the text for this new section..."></textarea>
        </div>
      </section>

      <section className="admin-section">
        <h2>Social Media Links</h2>
        <div className="form-group">
          <label>Twitter (Username or Link)</label>
          <input type="text" value={content.twitter || ''} onChange={e => handleContentChange('twitter', e.target.value)} placeholder="https://twitter.com/yourusername" />
        </div>
        <div className="form-group">
          <label>Instagram (Username or Link)</label>
          <input type="text" value={content.instagram || ''} onChange={e => handleContentChange('instagram', e.target.value)} placeholder="https://instagram.com/yourusername" />
        </div>
        <div className="form-group">
          <label>Facebook (Username or Link)</label>
          <input type="text" value={content.facebook || ''} onChange={e => handleContentChange('facebook', e.target.value)} placeholder="https://facebook.com/yourusername" />
        </div>
        <div className="form-group">
          <label>TikTok (Username or Link)</label>
          <input type="text" value={content.tiktok || ''} onChange={e => handleContentChange('tiktok', e.target.value)} placeholder="https://tiktok.com/@yourusername" />
        </div>
      </section>

      <section className="admin-section">
        <h2>News Management</h2>
        <form onSubmit={addNews} className="admin-form">
          <input type="text" placeholder="News Title" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
          <input type="file" id="newsFileInput" accept="image/*" onChange={e => setNewsForm({...newsForm, imageFile: e.target.files[0]})} />
          <textarea placeholder="News Content" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required></textarea>
          <button type="submit" className="btn-primary">Add News</button>
        </form>
        <div className="admin-list">
          {news.map(n => (
            <div key={n.id} className="admin-list-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {n.imageUrl && <img src={n.imageUrl} alt="preview" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />}
                <span>{n.title} ({n.date})</span>
              </div>
              <button onClick={() => deleteNews(n.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Gallery Management</h2>
        <form onSubmit={addGallery} className="admin-form">
          <input type="text" placeholder="Image/Video Title" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} required />
          <input type="file" id="galleryFileInput" accept="image/*,video/*" onChange={e => setGalleryForm({...galleryForm, imageFile: e.target.files[0]})} required />
          <select value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
            <option value="general">General</option>
            <option value="performances">Performances</option>
            <option value="cuisine">Cuisine</option>
            <option value="art">Art</option>
          </select>
          <button type="submit" className="btn-primary">Add Image</button>
        </form>
        <div className="admin-list">
          {gallery.map(g => (
            <div key={g.id} className="admin-list-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {g.imageUrl && <img src={g.imageUrl} alt="preview" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />}
                <span>{g.title} ({g.category || 'general'})</span>
              </div>
              <button onClick={() => deleteGallery(g.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Contact Submissions</h2>
        <div className="admin-list">
          {contacts.map(c => (
            <div key={c.id} className="admin-list-item contact-item">
              <div>
                <strong>{c.name} ({c.email})</strong> - {new Date(c.date).toLocaleDateString()}
                <p>{c.message}</p>
              </div>
            </div>
          ))}
          {contacts.length === 0 && <p>No messages yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default Admin;
