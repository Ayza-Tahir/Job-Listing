import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleApplyClick = () => {
    if (job?.apply_link) {
      // Case 1: apply_link exists → open it in a new tab
      window.open(job.apply_link, '_blank', 'noopener,noreferrer');
    } else {
      // Case 2: apply_link null or empty → show modal to apply through email
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="job-detail-container">Loading...</div>;
  if (error) return <div className="job-detail-container error">{error}</div>;

  return (
    <div className="job-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1 className="job-title">{job.job_title}</h1>

      <div className="job-info">
        <p><strong>Company:</strong> {job.company_name}</p>
        <p><strong>Email:</strong> {job.email || 'Not provided'}</p>
        <p><strong>Location:</strong> {job.city}, {job.country}</p>
        <p><strong>Address:</strong> {job.address}</p>
        <p><strong>Type:</strong> {job.job_type}</p>
        <p><strong>Expected Salary:</strong> {job.expected_salary || 'Not specified'}</p>
      </div>

      <div className="job-description">
        <h2>Job Description</h2>
        <p>{job.description}</p>
      </div>

      <div className="apply-section">
        <button className="apply-btn" onClick={handleApplyClick}>
          Apply Now
        </button>
      </div>

      
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>No direct application link available</h3>
            {job.email ? (
              <p>
                Please apply through email: <a href={`mailto:${job.email}`}>{job.email}</a>
              </p>
            ) : (
              <p>Please visit the company career page for application details.</p>
            )}
            <button className="close-modal-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
