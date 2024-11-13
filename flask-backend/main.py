# Refer to README under flask-backend directory to setup backend 
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
import os


load_dotenv()

app = Flask(__name__)
CORS(app)

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

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_email = data.get('email')
    password = data.get('password')
    print("Recieved email: ", new_email)    #debugging
    print("Recieved password: ", password)  #debugging
    
    try:
        # Add user to database
        new_user = User(email=new_email, password_hash=password, phone_number='N/A', name='none')
        db.session.add(new_user)
        db.session.commit()
        print("User successfully registered.")  #debugging
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error during registration:", e) #debugging
        return jsonify({"message": "Registration failed", "error": str(e)}), 400


if __name__ == '__main__':
    print("main")
    app.run(debug=True)

