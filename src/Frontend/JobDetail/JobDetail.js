import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="job-detail-container">Loading...</div>;
  if (error) return <div className="job-detail-container error">{error}</div>;

  return (
    <div className="job-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1 className="job-title">{job.job_title}</h1>

      <div className="job-info">
        <p><strong>Company:</strong> {job.company_name}</p>
        <p><strong>Email:</strong> {job.email}</p>
        <p><strong>Location:</strong> {job.city}, {job.country}</p>
        <p><strong>Address:</strong> {job.address}</p>
        <p><strong>Type:</strong> {job.job_type}</p>
        <p><strong>Expected Salary:</strong> {job.expected_salary || 'Not specified'}</p>
      </div>

      <div className="job-description">
        <h2>Job Description</h2>
        <p>{job.description}</p>
      </div>
    </div>
  );
}

export default JobDetail;
