from flask import Blueprint, request, jsonify
from models import Job
from db import db

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/jobs', methods=['POST'])
def add_job():
    data = request.get_json()

    required_fields = ['company_name', 'email', 'city', 'country', 'address', 'job_title', 'job_type', 'salary_range', 'description']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'message': 'Missing fields'}), 400

    job = Job(
        company_name=data['company_name'],
        email=data['email'],
        apply_link=data['apply_link'],
        city=data['city'],
        country=data['country'],
        address=data['address'],
        job_title=data['job_title'],
        job_type=data['job_type'],
        expected_salary=data['salary_range'],
        description=data['description']
    )
    db.session.add(job)
    db.session.commit()

    return jsonify({'message': 'Job added successfully', 'job_id': job.id}), 201


@jobs_bp.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.order_by(Job.posted_date.desc()).all()  
    jobs_list = [{
        'id': job.id,
        'company_name': job.company_name,
        'email': job.email,
        'apply_link': job.apply_link,
        'city': job.city,
        'country': job.country,
        'address': job.address,
        'job_title': job.job_title,
        'job_type': job.job_type,
        'expected_salary': job.expected_salary,
        'description': job.description,
    } for job in jobs]
    return jsonify(jobs_list)



@jobs_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'}), 200


@jobs_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job_by_id(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404

    job_data = {
        'id': job.id,
        'company_name': job.company_name,
        'email': job.email,
        'apply_link':job.apply_link,
        'city': job.city,
        'country': job.country,
        'address': job.address,
        'job_title': job.job_title,
        'job_type': job.job_type,
        'expected_salary': job.expected_salary,
        'description': job.description
    }

    return jsonify(job_data), 200
