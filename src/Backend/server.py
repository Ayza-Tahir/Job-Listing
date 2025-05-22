from flask import Flask
from flask_cors import CORS
from db import db
from routes import jobs_bp

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

# ✅ Corrected PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:aiza123@localhost:5432/joblistings'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(jobs_bp)

# ✅ Create tables if not exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
