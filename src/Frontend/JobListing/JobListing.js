import React, { useState, useEffect } from 'react';
import './JobListing.css';
import { useNavigate } from 'react-router-dom';

const countryOptions = ['USA', 'UK', 'India', 'Germany', 'Canada', 'Pakistan'];
const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];

function JobListing() {
  const [jobsData, setJobsData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteJobId, setDeleteJobId] = useState(null); 
  const jobsPerPage = 8;
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch('http://127.0.0.1:5000/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobsData(data);
        setFilteredJobs(data);
      })
      .catch((err) => console.error('Error fetching jobs:', err));
  }, []);

  
  const toggleSelection = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  
  const applyFilters = () => {
    const result = jobsData.filter((job) => {
      const matchCountry =
        selectedCountries.length === 0 || selectedCountries.includes(job.country);
      const matchType =
        selectedJobTypes.length === 0 || selectedJobTypes.includes(job.job_type);
      return matchCountry && matchType;
    });
    setFilteredJobs(result);
    setCurrentPage(1);
  };

 
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

 
  const confirmDelete = (jobId) => {
    setDeleteJobId(jobId);
  };

  
  const cancelDelete = () => {
    setDeleteJobId(null);
  };

  
  const handleDelete = () => {
    if (!deleteJobId) return;

    fetch(`http://127.0.0.1:5000/jobs/${deleteJobId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete job');
        return res.json();
      })
      .then(() => {
       
        setJobsData((prev) => prev.filter((job) => job.id !== deleteJobId));
        setFilteredJobs((prev) => prev.filter((job) => job.id !== deleteJobId));

        if ((currentPage - 1) * jobsPerPage >= filteredJobs.length - 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
        setDeleteJobId(null);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to delete job. Please try again.');
        setDeleteJobId(null);
      });
  };

  return (
    <div className="job-container">
      <div className="job-filters">
        <div className="filter-group">
          <label>Filter by Country</label>
          {countryOptions.map((country) => (
            <label key={country} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => toggleSelection(country, selectedCountries, setSelectedCountries)}
              />
              {country}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <label>Filter by Job Type</label>
          {jobTypeOptions.map((type) => (
            <label key={type} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedJobTypes.includes(type)}
                onChange={() => toggleSelection(type, selectedJobTypes, setSelectedJobTypes)}
              />
              {type}
            </label>
          ))}
        </div>

        <button className="apply-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

    
      <div className="job-layout1">
        {totalPages > 1 && (
          <div className="pagination-top-right">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  className={pageNum === currentPage ? 'active-page' : ''}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}

        {currentJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          currentJobs.map((job) => (
            <div key={job.id} className="job-banner">
              <div className="job-info">
                <span className="company">{job.company_name}</span>
                <div className="job-title-type">
                  <span className="title">{job.job_title}</span>
                  <span className="type">{job.job_type}</span>
                </div>
                <span className="location">
                  {job.city}, {job.country}
                </span>
              </div>
              <div className="job-actions">
                <button
                  className="open-btn"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  Open
                </button>
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      
      {deleteJobId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this job?</p>
            <div className="modal-buttons">
              <button className="btn-yes" onClick={handleDelete}>
                Yes
              </button>
              <button className="btn-no" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobListing;
