import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import API_URL from '../api';
import './Contact.css';

const Contact = () => {
  const [content, setContent] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setContent(data.data);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Failed to connect to server.');
    }
  };

  return (
    <div className="contact-container">
      <BackButton />
      <h1 className="section-title">Get In Touch</h1>
      
      <div className="contact-wrapper">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>Contact Information</h2>
          <p>Reach out to us for event planning, cultural promotion, or any inquiries regarding the festival.</p>
          
          <div className="info-item">
            <span className="icon">📍</span>
            <div>
              <h3>Location</h3>
              <p>{content.address || 'Mbarara City, Kigezi Region, Uganda'}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div>
              <h3>Phone</h3>
              <p><a href={`tel:${content.contactPhone || '0755121457'}`} style={{color: 'inherit', textDecoration: 'none'}}>{content.contactPhone || '0755121457'}</a></p>
              <p><a href={`tel:0704474746`} style={{color: 'inherit', textDecoration: 'none'}}>0704474746</a></p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p><a href={`mailto:${content.contactEmail || 'tugyendanekigezifestival@gmail.com'}`} style={{color: 'inherit', textDecoration: 'none'}}>{content.contactEmail || 'tugyendanekigezifestival@gmail.com'}</a></p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your Email" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Your Message" rows="5"></textarea>
            </div>
            <button type="submit" className="btn-primary form-btn">Send Message</button>
            {status && <p className="form-status">{status}</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
