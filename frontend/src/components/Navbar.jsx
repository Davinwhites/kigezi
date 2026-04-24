import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src={logoImg} alt="Tugyedane Kigezi Logo" className="logo-img" />
        </Link>
        
        <div className="mobile-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={`nav-links ${isActive('/')}`} onClick={toggleMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={`nav-links ${isActive('/about')}`} onClick={toggleMenu}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/gallery" className={`nav-links ${isActive('/gallery')}`} onClick={toggleMenu}>Gallery</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className={`nav-links ${isActive('/contact')}`} onClick={toggleMenu}>Contact</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className={`nav-links ${isActive('/admin')}`} onClick={toggleMenu}>Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
