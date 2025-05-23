from datetime import datetime
from db import db

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    apply_link = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    job_title = db.Column(db.String, nullable=False)
    job_type = db.Column(db.String, nullable=False)
    expected_salary = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    
    posted_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


    def __repr__(self):
        return f"<Job {self.job_title} at {self.company_name}>"
