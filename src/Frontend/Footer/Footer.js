import React from 'react';
import './Footer.css';
import logo from './../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from 'react-router-dom';

function Footer({ onListJobsClick }) {
  const location = useLocation();

  const handleJobListClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      onListJobsClick?.();
    }
  };

  return (
    <div className="footer-layout1">
      <div className="footer-layout2">
        <img src={logo} alt="Logo" className="footer-logo" />
      </div>

      <div className="footer-layout3">
        <div className="footer-box">
          <div className="footer-title">Job Search</div>

          {location.pathname === '/' ? (
            <a
              href="/"
              className="footer-subtitle"
              onClick={handleJobListClick}
              role="button"
              tabIndex={0}
            >
              Job Listing
            </a>
          ) : (
            <Link to="/" className="footer-subtitle">
              Job Listing
            </Link>
          )}
        </div>

        <div className="footer-box">
          <div className="footer-title">Add Job</div>
          <Link to="/AddJob" className="footer-subtitle">
            Form
          </Link>
        </div>

        <div className="footer-box">
          <div className="footer-title">Location</div>
          <a 
    href="https://www.google.com/maps/dir//Plaza%23H2,+DHA+Rahbar+phase+11+Gate+4,+2+Street+20,+Block+H+Lahore,+54000/@31.3830298,74.1930692,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3919ab2e3a4d8ce5:0xd0226f0200043504!2m2!1d74.2754706!2d31.3830561?entry=ttu&g_ep=EgoyMDI1MDUxNS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="footer-subtitle"
  >
    Our Office
  </a>
        </div>

        <div className="footer-box">
          <div className="footer-title">Contact</div>
         <div className="footer-subtitle">Email:help@bitbash.com</div>
        </div>
      </div>

      <div className="footer-layout4">
        <div className="footer-layout5">
          <div className="social-start">
          <a
        href="https://www.bitbash.dev/"
        target="_blank"
        rel="noopener noreferrer"
      
      >
      
            <FontAwesomeIcon icon={faGoogle} className="social-icon" />
            </a>
          </div>
          <div className="social-end">
          <a
              href="https://www.linkedin.com/company/bitbashcompany/"
              target="_blank"
              rel="noopener noreferrer"
          
            >
            <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
