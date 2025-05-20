import React, { useState } from 'react';
import './AddJob.css';

function AddJob() {
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        setShowPopup(true); 
        form.reset();      
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="add_job-layout1">
            <form className="job-form" onSubmit={handleSubmit}>
                <h2>Post a New Job</h2>

                <label>Company Name</label>
                <input type="text" placeholder="Enter company name" required />

                <label>Email</label>
                <input type="email" placeholder="Enter contact email" required />
                
                <label>Location</label>
                <input type="text" placeholder="Enter location" required />

                <label>City</label>
                <input type="text" placeholder="Enter city" required />

                <label>Country</label>
                <select required>
                    <option value="">Select country</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>
                    <option value="Pakistan">Pakistan</option>
                </select>

                <label>Address</label>
                <input type="text" placeholder="Enter full address" required />

                <label>Job Title</label>
                <input type="text" placeholder="Enter job title" required />

                <label>Job Type</label>
                <select required>
                    <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>

                <label>Job Description</label>
                <textarea rows="4" placeholder="Enter job description" required></textarea>

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
