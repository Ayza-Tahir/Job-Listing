import React from 'react';
import './Header.css';
import header_img from './../../assets/header_img.jpeg';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <div className="header-layout1">
      <img src={header_img} alt="Header" className="header-image" />
      <div className="header-layout2">
      <div className="header-layout3">
      <p className="header-text">
            You can easily add job listings here. Just fill in the job details and submit the form. It’s a quick way to share opportunities and help others find the right role. Posting a job takes only a few minutes.
          </p>
        </div>
        <div className="header-layout4">
        <Link to="/AddJob" className="add-job-button">Add Job</Link>
      </div>
      </div>
    </div>
  );
}

export default Header;
