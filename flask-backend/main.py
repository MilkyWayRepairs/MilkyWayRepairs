# Refer to README under flask-backend directory to setup backend 
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os


load_dotenv()

app = Flask(__name__)

# Configure the SQLAlchemy part of the application
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("PERSONAL_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemySS
db = SQLAlchemy(app)

# Define a model for your user table
class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(100), nullable=False)


@app.route('/add_user')
def add_user():
    try:
        # Add a new user
        new_user = User(email='therealrobbrownie@hotmail.com', password_hash='WARMACHINEROX', 
                        phone_number='8089992012', name='Robert Brownie Jr.')
        db.session.add(new_user)
        db.session.commit()

        # Retrieve all users
        users = User.query.all()
        for user in users:
            print(user.email, user.name)

        return "User added and data retrieved!"

    except Exception as e:
        print("Error during database operation:", e)
        return "Database operation failed."



if __name__ == '__main__':
    app.run(debug=True)

