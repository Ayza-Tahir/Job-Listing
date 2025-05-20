import React from 'react';
import './NavBar.css';
import logo from './../../assets/logo.png';
import background from './../../assets/background.jpg';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function NavBar({ onListJobsClick }) {
  const location = useLocation();
  

  const handleJobListClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      onListJobsClick?.();
    }
  };

  return (
    <div className="navbar-layout1">
      <img src={background} alt="Main" className="navbar-background" />

      <div className="navbar-layout2">
        <img src={logo} alt="Main" className="navbar-logo" />
      </div>

      <div className="navbar-layout3">
        <div className="navbar-box">
          <Link to="/" className="navbar-subtitle">Home</Link>
        </div>

        <div className="navbar-box">
         {location.pathname === '/' ? (
                    <a
                      href="/"
                      className="navbar-subtitle"
                      onClick={handleJobListClick}
                      role="button"
                      tabIndex={0}
                    >
                      Job Listing
                    </a>
                  ) : (
                    <Link to="/" className="navbar-subtitle">
                      Job Listing
                    </Link>
                  )}
        </div>

        <div className="navbar-box">
          <Link to="/AddJob" className="navbar-subtitle">Add Job</Link>
        </div>

        <div className="navbar-box">
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

export default NavBar;
