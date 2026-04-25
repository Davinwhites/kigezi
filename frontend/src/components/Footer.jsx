import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../api';
import './Footer.css';

const Footer = () => {
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setContent(data.data);
      });
  }, []);

  const getSocialLink = (platform, value) => {
    if (!value) {
      switch(platform) {
        case 'twitter': return `https://twitter.com/TugyendaneKigezi`;
        case 'instagram': return `https://www.instagram.com/tugyendanekigezi/`;
        case 'facebook': return `https://facebook.com/TugyendaneKigezi`;
        case 'tiktok': return `https://tiktok.com/@tugyendanekigezi`;
        default: return "#";
      }
    }
    if (value.startsWith('http')) return value;
    // Clean the value: remove spaces and @, then lowercase
    let username = value.replace('@', '').replace(/\s/g, '').toLowerCase().trim();
    switch(platform) {
      case 'twitter': return `https://twitter.com/${username}`;
      case 'instagram': return `https://www.instagram.com/${username}/`;
      case 'facebook': return `https://facebook.com/${username}`;
      case 'tiktok': return `https://tiktok.com/@${username}`;
      default: return value;
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>Tugyedane Kigezi</h3>
          <p>Celebrating the vibrant culture, dance, and heritage of the Bakiga people.</p>
          <div className="footer-contact-info" style={{marginTop: '20px'}}>
            <p><strong>📧 Email:</strong> <a href={`mailto:${content.contactEmail || 'tugyendanekigezifestival@gmail.com'}`} style={{color: '#fff', textDecoration: 'none'}}>{content.contactEmail || 'tugyendanekigezifestival@gmail.com'}</a></p>
            <p><strong>📞 Phone:</strong> <a href="tel:0755121457" style={{color: '#fff', textDecoration: 'none'}}>0755121457</a>, <a href="tel:0704474746" style={{color: '#fff', textDecoration: 'none'}}>0704474746</a></p>
          </div>
        </div>
        
        <div className="footer-links">
          <h3>Navigation</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li><Link to="/" style={{color: '#fff', textDecoration: 'none', lineHeight: '2'}}>Home</Link></li>
            <li><Link to="/about" style={{color: '#fff', textDecoration: 'none', lineHeight: '2'}}>About Us</Link></li>
            <li><Link to="/gallery" style={{color: '#fff', textDecoration: 'none', lineHeight: '2'}}>Festival Gallery</Link></li>
            <li><Link to="/contact" style={{color: '#fff', textDecoration: 'none', lineHeight: '2'}}>Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href={getSocialLink('tiktok', content.tiktok)} target="_blank" rel="noreferrer" className="tiktok-icon" title="TikTok">
              <svg viewBox="0 0 448 512" width="24" height="24" fill="currentColor">
                <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
              </svg>
            </a>
            <a href={getSocialLink('instagram', content.instagram)} target="_blank" rel="noreferrer" title="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href={getSocialLink('facebook', content.facebook)} target="_blank" rel="noreferrer" title="Facebook">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href={getSocialLink('twitter', content.twitter)} target="_blank" rel="noreferrer" title="X (Twitter)">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tugyedane Kigezi Festival Management. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
