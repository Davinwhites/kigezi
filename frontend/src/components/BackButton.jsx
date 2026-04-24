import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on the home page
  if (location.pathname === '/') return null;

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
