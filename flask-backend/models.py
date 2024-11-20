from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4


# Initialize SQLAlchemySS
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

# Define a model for your user table
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20))
    name = db.Column(db.String(100))
    role = db.Column(db.String(10))

class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True)
    review_text = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    num_of_stars = db.Column(db.String(20))
