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
  const [isUploading, setIsUploading] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  
  const [isUploadingNews, setIsUploadingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState(null);

  const fetchData = async () => {
    try {
      const [contentRes, newsRes, galleryRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/content`),
        fetch(`${API_URL}/api/news`),
        fetch(`${API_URL}/api/gallery`),
        fetch(`${API_URL}/api/contact`)
      ]);

      const [contentData, newsData, galleryData, contactsData] = await Promise.all([
        contentRes.json(),
        newsRes.json(),
        galleryRes.json(),
        contactsRes.json()
      ]);

      if (!contentRes.ok) console.error("Content fetch failed", contentData.error);
      if (!newsRes.ok) console.error("News fetch failed", newsData.error);
      if (!galleryRes.ok) console.error("Gallery fetch failed", galleryData.error);
      if (!contactsRes.ok) console.error("Contacts fetch failed", contactsData.error);

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
    setIsUploadingNews(true);
    const formData = new FormData();
    formData.append('title', newsForm.title);
    formData.append('content', newsForm.content);
    if (newsForm.imageFile) formData.append('image', newsForm.imageFile);

    try {
      if (editingNewsId) {
        await fetch(`${API_URL}/api/news/${editingNewsId}`, {
          method: 'PUT',
          body: formData
        });
        setEditingNewsId(null);
      } else {
        await fetch(`${API_URL}/api/news`, {
          method: 'POST',
          body: formData
        });
      }
      setNewsForm({ title: '', content: '', imageFile: null });
      const fileInput = document.getElementById('newsFileInput');
      if(fileInput) fileInput.value = '';
      alert(editingNewsId ? 'News updated!' : 'News added!');
    } catch (err) {
      console.error(err);
      alert('News upload failed!');
    }
    setIsUploadingNews(false);
    fetchData();
  };

  const handleEditNews = (n) => {
    setEditingNewsId(n.id);
    setNewsForm({ title: n.title, content: n.content, imageFile: null });
    window.scrollTo({ top: document.getElementById('news-section').offsetTop, behavior: 'smooth' });
  };

  const deleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    try {
      const res = await fetch(`${API_URL}/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('News deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete news.');
      }
    } catch (err) {
      alert('Network error while deleting news.');
    }
  };

  const addGallery = async (e, categoryOverride = null) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    const finalCategory = categoryOverride || galleryForm.category;
    formData.append('title', galleryForm.title);
    formData.append('category', finalCategory);
    if (galleryForm.imageFile) formData.append('image', galleryForm.imageFile);

    try {
      let res;
      if (editingGalleryId) {
        res = await fetch(`${API_URL}/api/gallery/${editingGalleryId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        res = await fetch(`${API_URL}/api/gallery`, {
          method: 'POST',
          body: formData
        });
      }
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error occurred');
      }
      
      setEditingGalleryId(null);
      setGalleryForm({ title: '', category: 'general', imageFile: null });
      // Reset all file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      alert('Media saved successfully!');
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    }
    
    setIsUploading(false);
    fetchData();
  };

  const handleEditGallery = (g) => {
    setEditingGalleryId(g.id);
    setGalleryForm({ title: g.title, category: g.category || 'general', imageFile: null });
    window.scrollTo({ top: document.getElementById('gallery-section').offsetTop, behavior: 'smooth' });
  };

  const deleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Media deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete media.');
      }
    } catch (err) {
      alert('Network error while deleting.');
    }
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
          <label>About Us - Main Text</label>
          <textarea value={content.aboutText || ''} onChange={e => handleContentChange('aboutText', e.target.value)} rows="4"></textarea>
        </div>
        <div className="form-group">
          <label>Our Purpose</label>
          <textarea value={content.aboutPurpose || ''} onChange={e => handleContentChange('aboutPurpose', e.target.value)} rows="3"></textarea>
        </div>
        <div className="form-group">
          <label>Our Vision</label>
          <textarea value={content.aboutVision || ''} onChange={e => handleContentChange('aboutVision', e.target.value)} rows="3"></textarea>
        </div>
        <div className="form-group">
          <label>Core Values</label>
          <textarea value={content.aboutValues || ''} onChange={e => handleContentChange('aboutValues', e.target.value)} rows="2"></textarea>
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
          <input type="email" value={content.contactEmail || 'tugyendanekigezifestival@gmail.com'} onChange={e => handleContentChange('contactEmail', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input type="text" value={content.contactPhone || '0755121457'} onChange={e => handleContentChange('contactPhone', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Office Address</label>
          <input type="text" value={content.address || 'Mbarara City, Kigezi Region, Uganda'} onChange={e => handleContentChange('address', e.target.value)} />
        </div>
        <div className="form-group" style={{borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px'}}>
          <h3>Social Media Handles</h3>
          <p style={{fontSize: '0.8rem', color: '#666'}}>Enter the username only (e.g. <strong>tugyendanekigezi</strong>)</p>
        </div>
        <div className="form-group">
          <label>TikTok Username</label>
          <input type="text" value={content.tiktok || 'tugyendanekigezi'} onChange={e => handleContentChange('tiktok', e.target.value)} placeholder="@tugyendanekigezi" />
        </div>
        <div className="form-group">
          <label>Instagram Username</label>
          <input type="text" value={content.instagram || 'tugyendanekigezi'} onChange={e => handleContentChange('instagram', e.target.value)} placeholder="tugyendanekigezi" />
        </div>
        <div className="form-group">
          <label>Twitter/X Username</label>
          <input type="text" value={content.twitter || 'TugyendaneKigezi'} onChange={e => handleContentChange('twitter', e.target.value)} placeholder="TugyendaneKigezi" />
        </div>
        <div className="form-group">
          <label>Facebook Username/Page ID</label>
          <input type="text" value={content.facebook || 'TugyendaneKigezi'} onChange={e => handleContentChange('facebook', e.target.value)} placeholder="TugyendaneKigezi" />
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

      <section className="admin-section" id="news-section">
        <h2>News Management</h2>
        <form onSubmit={addNews} className="admin-form">
          <input type="text" placeholder="News Title" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
          <input type="file" id="newsFileInput" accept="image/*" onChange={e => setNewsForm({...newsForm, imageFile: e.target.files[0]})} required={!editingNewsId} />
          <textarea placeholder="News Content" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required></textarea>
          <button type="submit" className="btn-primary" disabled={isUploadingNews}>
            {isUploadingNews ? 'Uploading...' : (editingNewsId ? 'Update News' : 'Add News')}
          </button>
          {editingNewsId && (
            <button type="button" className="btn-secondary" style={{padding: '12px 28px', borderRadius: '30px', marginLeft: '10px'}} onClick={() => { setEditingNewsId(null); setNewsForm({ title: '', content: '', imageFile: null }); }}>Cancel Edit</button>
          )}
        </form>
        <div className="admin-list">
          {news.map(n => (
            <div key={n.id} className="admin-list-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {n.imageUrl && <img src={n.imageUrl} alt="preview" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />}
                <span>{n.title} ({n.date})</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditNews(n)} style={{backgroundColor: '#ff8f00', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => deleteNews(n.id)} style={{backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section" id="gallery-section">
        <h2>Post Media to Specific Pages</h2>
        <div style={{background: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ffeeba'}}>
          <p style={{fontSize: '0.9rem', color: '#856404', margin: 0}}><strong>Note:</strong> Use the specific boxes below to make sure your photos/videos go to the right page.</p>
        </div>

        {/* Dynamic Category Forms */}
        {['performances', 'cuisine', 'art', 'general'].map(cat => (
          <div key={cat} style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #dee2e6'}}>
            <h3 style={{textTransform: 'capitalize', color: '#ff8f00', marginBottom: '15px'}}>
              {cat === 'performances' && '🎭 Cultural Performances Page'}
              {cat === 'cuisine' && '🍲 Local Cuisine Page'}
              {cat === 'art' && '🎨 Art Exhibitions Page'}
              {cat === 'general' && '🖼️ General Gallery'}
            </h3>
            
            <form onSubmit={(e) => addGallery(e, cat)} className="admin-form">
              <input 
                type="text" 
                placeholder={`Title for ${cat}...`} 
                value={editingGalleryId && galleryForm.category === cat ? galleryForm.title : (galleryForm.category === cat ? galleryForm.title : '')} 
                onChange={e => { setGalleryForm({...galleryForm, title: e.target.value, category: cat}); }} 
                required={galleryForm.category === cat || !galleryForm.category} 
              />
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => { setGalleryForm({...galleryForm, imageFile: e.target.files[0], category: cat}); }} 
                required={(!editingGalleryId && galleryForm.category === cat)} 
              />
              <button type="submit" className="btn-primary" disabled={isUploading && galleryForm.category === cat}>
                {(isUploading && galleryForm.category === cat) ? 'Uploading...' : (editingGalleryId && galleryForm.category === cat ? 'Update' : `Post to ${cat}`)}
              </button>
              {editingGalleryId && galleryForm.category === cat && (
                <button type="button" className="btn-secondary" style={{padding: '12px 28px', borderRadius: '30px', marginLeft: '10px'}} onClick={() => { setEditingGalleryId(null); setGalleryForm({ title: '', category: 'general', imageFile: null }); }}>Cancel</button>
              )}
            </form>

            <div className="admin-list" style={{marginTop: '15px'}}>
              {gallery.filter(g => (g.category || 'general') === cat).length > 0 ? (
                gallery.filter(g => (g.category || 'general') === cat).slice(0, 5).map(g => (
                  <div key={g.id} className="admin-item" style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {g.imageUrl && (
                        g.imageUrl.match(/\.(mp4|mov|avi|webm)$/) || g.imageUrl.includes('video/upload') ? 
                        <video src={g.imageUrl} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}} muted /> :
                        <img src={g.imageUrl} alt="preview" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}} />
                      )}
                      <span style={{fontSize: '0.9rem'}}>{g.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEditGallery(g)} style={{backgroundColor: '#ff8f00', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem'}}>Edit</button>
                      <button onClick={() => deleteGallery(g.id)} style={{backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem'}}>Delete</button>
                    </div>
                  </div>
                ))
              ) : <p style={{color: '#999', fontSize: '0.8rem'}}>Nothing posted here yet.</p>}
            </div>
          </div>
        ))}
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
