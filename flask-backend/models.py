import datetime
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

from sqlalchemy import func


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
    text = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    num_of_stars = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

class Message(db.Model):
    __tablename__ = 'message'
    message_id = db.Column(db.Integer, primary_key=True)  # Match the database schema
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)