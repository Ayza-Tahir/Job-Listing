import React, { useState } from 'react';
import './AddJob.css';

function AddJob() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }



    const formData = {
      company_name: form.company_name.value.trim(),
      email: form.email.value.trim(),
      apply_link: form.apply_link.value.trim(),
      city: form.city.value.trim(),
      country: form.country.value,
      address: form.address.value.trim(),
      job_title: form.job_title.value.trim(),
      job_type: form.job_type.value,
      salary_range: form.salary_range.value.trim(),
      description: form.description.value.trim(),
    };

    try {
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowPopup(true);
        form.reset();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to add job'));
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="add_job-layout1">
      <form className="job-form" onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>

        <label>Company Name</label>
        <input name="company_name" type="text" placeholder="Enter company name" required />

        <label>Email</label>
        <input name="email" type="email" placeholder="Enter contact email" required />

        <label>Apply Link</label>
        <input name="apply_link" type="url" placeholder="Enter Apply Link" />


        <label>City</label>
        <input name="city" type="text" placeholder="Enter city" required />

        <label>Country</label>
        <select name="country" required>
          <option value="">Select country</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="India">India</option>
          <option value="Germany">Germany</option>
          <option value="Canada">Canada</option>
          <option value="Pakistan">Pakistan</option>
        </select>

        <label>Address</label>
        <input name="address" type="text" placeholder="Enter full address" />

        <label>Job Title</label>
        <input name="job_title" type="text" placeholder="Enter job title" required />

        <label>Job Type</label>
        <select name="job_type" required>
          <option value="">Select job type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        <label>Expected Salary Range</label>
        <input
          name="salary_range"
          type="text"
          placeholder="e.g. 30000-50000"
          pattern="^\s*\d+\s*-\s*\d+\s*$"
          title="Enter salary range like 30000-50000"
          required
        />

        <label>Description</label>
        <textarea name="description" rows="4" placeholder="Enter job description" required></textarea>

        <button type="submit">Submit Job</button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Job Added Successfully!</h3>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddJob;
