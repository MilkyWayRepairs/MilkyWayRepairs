# Refer to README under flask-backend directory to setup backend 
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
# from flask_session import Session
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from models import db, User, Review, Message, Appointments
import os, re, dns.resolver, requests

# Sendbird Configuration
SENDBIRD_API_TOKEN = os.getenv("SENDBIRD_API_TOKEN")
SENDBIRD_APP_ID = os.getenv("SENDBIRD_APP_ID")
HEADERS = {
    'Content-Type': 'application/json',
    'Api-Token': SENDBIRD_API_TOKEN
}


load_dotenv()
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)
#with app.app_context():
#   db.create_all()

# Configure the SQLAlchemy part of the application
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("PERSONAL_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Make sure that there is a secret key in your .env file to manage sessions
app.secret_key = os.getenv("SECRET_KEY")

# Creates personal session token for each user
@app.route("/@me")
def get_current_user():
    id = session.get("id")

    if not id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 


def doesEmailExists(email):
    users = User.query.all()
    for user in users:
        if email == user.email:
            print("email alreay in use")
            return True
    print("email not in use")
    return False


def validateEmail(email):
    # Extract the domain part from the email
    domain = email.split('@')[1]
    
    # Check if the domain has MX records (Mail Exchange records)
    try:
        dns.resolver.resolve(domain, 'MX')
        return True  # Domain is valid and has MX records
    except dns.resolver.NXDOMAIN:
        return False  # Domain does not exist
    except dns.resolver.NoAnswer:
        return False  # Domain exists but has no MX records
    except dns.exception.DNSException:
        return False  # Other DNS errors
    
def validatePassword(password):
    validPassword = r'^(?=.{8,})(?=(?:[^!#$%&]*[!#$%&]){3,})(?=.*[a-zA-Z0-9])[a-zA-Z0-9!#$%&]+$'
    return re.match(validPassword, password) is not None


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print("Recieved email: ", email)    #debugging
    print("Recieved password: ", password)  #debugging

    if (doesEmailExists(email)):
        return jsonify({
        "message": "Email already in use\nEnter a differnt email",
        "code": 1
        }), 200
    elif not validateEmail(email):
        return jsonify({
            "message": "Not a valid email",
            "code": 2
        })
    elif not validatePassword(password):
        return jsonify({
            "message": "Not a valid password"
        })
    else:
        try:
            # Add user to database
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(email=email, password_hash=hashed_password, phone_number='N/A', name='none', role='user')
            db.session.add(new_user)
            db.session.commit()
            print("User successfully registered.")  #debugging
            return jsonify({
                "message": "User registered successfully", 
                "code": 0
                }), 200
        except Exception as e:
            db.session.rollback()
            print("Error during registration:", e) #debugging
            return jsonify({
                "message": "Registration failed", 
                "error": str(e)
                }), 400


# Sever sided session login authentication
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

@app.route('/reviews', methods=['POST', 'GET'])
def reviews():
    if request.method == 'POST':
        data = request.get_json()
        id = session.get("id")
        review_text = data.get('review')
        rating = data.get('rating')

        if not review_text or not rating:
            return jsonify({"error": "Review content and rating are required."}), 400

        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be between 1 and 5."}), 400

        try:
            new_review = Review(text=review_text, user_id=id, num_of_stars=rating)
            db.session.add(new_review)
            db.session.commit()
            print("Review was added to db")
            return jsonify({"message": "Review submitted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error: ", e)
            return jsonify({"error": "Failed to submit review", "details": str(e)}), 400

    elif request.method == 'GET':
        return get_reviews()

def get_reviews():
    reviews = Review.query.all()
    reviews_list = [
        {
            "id": review.id,
            "user_id": review.user_id,
            "text": review.text,
            "stars": review.num_of_stars,
            "created_at": review.created_at
        }
        for review in reviews
    ]
    return jsonify(reviews_list)


#messages   
     
# Update the Endpoint to Create or Fetch a Chat Channel
@app.route('/chat', methods=['POST'])
def get_or_create_chat():
    data = request.json
    sender_id = str(data['sender_id'])
    receiver_id = str(data['receiver_id'])

    # Create or get a Sendbird group channel
    channel_url = f'channel_{sender_id}_{receiver_id}'
    create_channel_url = f'https://api-{SENDBIRD_APP_ID}.sendbird.com/v3/group_channels'
    payload = {
        'user_ids': [sender_id, receiver_id],
        'is_distinct': True,
        'channel_url': channel_url
    }

    response = requests.post(create_channel_url, headers=HEADERS, json=payload)

    if response.status_code == 200:
        return jsonify({'message': 'Chat created successfully', 'channel_url': channel_url}), 200
    else:
        return jsonify({'error': 'Failed to create chat', 'details': response.json()}), 400


      
# Endpoint to create a new chat if it doesn't exist
@app.route('/start_chat', methods=['POST'])
def start_chat():
    data = request.json
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    
    # Check if a chat already exists
    existing_messages = Message.query.filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    ).first()

    if existing_messages:
        return jsonify({"message": "Chat already exists"}), 200

    # Optionally, create an initial record indicating a new chat is started
    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content="Chat started",
        timestamp=datetime.now()
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"message": "New chat started"}), 201

# Fetch Messages from Sendbird
@app.route('/messages/<channel_url>', methods=['GET'])
def get_messages(channel_url):
    # Fetch messages from the Sendbird channel
    get_messages_url = f'https://api-{SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/{channel_url}/messages'
    response = requests.get(get_messages_url, headers=HEADERS)

    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'error': 'Failed to retrieve messages', 'details': response.json()}), 400



@app.route('/messages', methods=['POST'])
def send_message():
    data = request.json
    sender_id = str(data['sender_id'])
    channel_url = data['channel_url']
    message_content = data['content']

    # Send a message via Sendbird
    send_message_url = f'https://api-{SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/{channel_url}/messages'
    payload = {
        'message_type': 'MESG',
        'user_id': sender_id,
        'message': message_content
    }
    response = requests.post(send_message_url, headers=HEADERS, json=payload)

    if response.status_code == 200:
        return jsonify({'message': 'Message sent successfully'}), 201
    else:
        return jsonify({'error': 'Failed to send message', 'details': response.json()}), 400


#select user to start chatting
@app.route('/users', methods=['GET'])
def get_users():
    try:
        # Fetch all users except the current logged-in user
        users = User.query.all()


        # Serialize user data
        users_data = [{'id': user.id, 'name': user.name, 'email': user.email} for user in users]

        return jsonify(users_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching users: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
# makes sure that time being sent is not conflicting with other appointments
# might not add
'''
def is_conflicting(date, time):
    # Convert the time to a datetime object for easier comparison
    start_time = (datetime.combine(date, time) - timedelta(minutes=30)).time()
    end_time = (datetime.combine(date, time) + timedelta(minutes=30)).time()

    print(f"Checking conflicts for date: {date}, time: {time}")
    print(f"Time range: {start_time} - {end_time}")

    try:
        # Query the database for overlapping appointments
        conflict = Appointments.query.filter(
            Appointments.date == date,
            Appointments.time >= start_time,
            Appointments.time <= end_time
        ).first()

        print("Query executed successfully")
        print(f"Conflict result: {conflict}")

        return conflict is not None
    except Exception as e:
        print("Error during conflict check:", e)
        return False
'''
    
@app.route('/scheduleAppointment', methods=['POST'])
def schedule_appointment():
    try:
        data = request.get_json()

        name = data.get('name')
        appointment_datetime = data.get('appointment_date')

        if not name or not appointment_datetime:
            return jsonify({"message": "Name and appointment data are required"}), 400
        
        # parse the ISO date into a python datetime object
        parsed_datetime = datetime.fromisoformat(appointment_datetime)
        appointment_date = parsed_datetime.date()
        appointment_time = parsed_datetime.time()

        # Check for conflicts
        # Might not add
        '''
        if is_conflicting(appointment_date, appointment_time):
            return jsonify({"message": "The chosen time conflicts with another appointment"}), 409
        '''

        # save the appointment to the database
        new_appointment = Appointments(date=appointment_date, time=appointment_time, name=name)
        db.session.add(new_appointment)
        db.session.commit()

        return jsonify({"message": f"Appointment scheduled for {name} on {appointment_date} at {appointment_time}"}), 200
    except ValueError as e:
        return jsonify({"message": "Invalid date format", "error": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An error occurred in the backend", "error": str(e)}), 500

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("id", None)
    return "200"


if __name__ == '__main__':
    print("main")
    app.run(host="0.0.0.0", port=5000, debug=True)

