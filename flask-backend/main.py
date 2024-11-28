# Refer to README under flask-backend directory to setup backend 
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
# from flask_session import Session
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from datetime import datetime
from models import db, User, Review, Message, Vehicle, Service, Job, Log
from datetime import datetime, timedelta
from models import db, User, Review, Message, Appointments
import os, re, dns.resolver, requests, time, random



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
HEADERS = ApplicationConfig.HEADERS
SENDBIRD_APP_ID = ApplicationConfig.SENDBIRD_APP_ID
    
@app.route('/chat', methods=['POST'])
def get_or_create_chat():
    data = request.json
    if 'sender_id' not in data or 'receiver_id' not in data:
        return jsonify({'error': 'Missing sender_id or receiver_id'}), 400

    try:
        sender_id = str(data['sender_id'])
        receiver_id = str(data['receiver_id'])
    except ValueError:
        return jsonify({'error': 'Invalid sender_id or receiver_id'}), 400

    # Create or get a Sendbird group channel
    create_channel_url = f'https://api-{SENDBIRD_APP_ID}.sendbird.com/v3/group_channels'
    payload = {
        'user_ids': [sender_id, receiver_id],
        'is_distinct': True,
        'name': f'Chat between {sender_id} and {receiver_id}',
    }

    response = requests.post(create_channel_url, headers=HEADERS, json=payload)

    if response.status_code in [200, 201]:
        response_data = response.json()
        channel_url = response_data.get('channel_url')
        app.logger.info(f"Channel created successfully: {response_data}")
        return jsonify({'message': 'Chat created successfully', 'channel_url': channel_url}), 200
    else:
        app.logger.error(f"Failed to create chat. Response from Sendbird: {response.status_code}, {response.text}")
        return jsonify({'error': 'Failed to create chat', 'details': response.json()}), 405




     
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

#checks if a chat exists
@app.route('/chat', methods=['POST'])
def get_or_create_chat():
    data = request.json
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']

    # Check if a chat already exists
    existing_messages = Message.query.filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.sender_id == sender_id))
    ).all()

    if existing_messages:
        # Chat already exists, return existing chat
        chat_messages = [{'id': msg.message_id, 'content': msg.content, 'sender': msg.sender_id, 'timestamp': msg.timestamp.isoformat()} for msg in existing_messages]
        return jsonify({"chat_exists": True, "messages": chat_messages}), 200

    # Create a new chat if it doesn't exist
    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content="Chat started",
        timestamp=datetime.now()
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"chat_exists": False, "message": "New chat created"}), 201


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
    

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("id", None)
    return "200"

@app.route('/get-vehicle-status', methods=['POST', 'GET'])
def get_status():
    user_id = session.get("id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        vehicle = Vehicle.query.filter_by(user_id=user_id).first()

        if not vehicle:
            return jsonify({"error:" "No vehicle found for this user"}), 401

        vehicle_data = {
            "VIN": vehicle.VIN,
            "make": vehicle.make,
            "model": vehicle.model,
            "year": vehicle.year,
            "status": vehicle.status,
        }

        return jsonify(vehicle_data), 200
    except Exception as e:
        app.logger.error(f"Error retrieving vehicle status: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/search-vehicle', methods=['POST'])
def search_vehicle():
    data = request.json
    make = data.get('make')
    model = data.get('model')
    year = data.get('year')
    vin = data.get('vin')

    try:
        query = Vehicle.query

        if make:
            query = query.filter(Vehicle.make.ilike(f"%{make}%"))
        if model:
            query = query.filter(Vehicle.model.ilike(f"%{model}%"))
        if year:
            query = query.filter_by(year=year)
        if vin:
            query = query.filter_by(vin=vin)

        vehicles = query.all()

        vehicle_list = [{
            "make": vehicle.make,
            "model": vehicle.model,
            "year": vehicle.year,
            "VIN": vehicle.VIN,
            "status": vehicle.status
        } for vehicle in vehicles]

        return jsonify(vehicle_list), 200

    except Exception as e:
        app.logger.error(f"Error searching vehicles: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    from datetime import datetime, time, timedelta

# finds conflicting times for appoinement scheduling 
@app.route('/available-times', methods=['GET'])
def get_available_times():
    try:
        date = request.args.get('date')
        if not date:
            return jsonify({"error": "Date is required"}), 400

        query_date = datetime.strptime(date, '%Y-%m-%d').date()

        start_time = time(8, 0)  # 8:00 AM   
        end_time = time(17, 0)  # 5:00 PM
        time_interval = timedelta(minutes=30)  # 30-minute intervals

        # Query the database for services on the given date
        taken_slots = Service.query.filter(
            func.date(Service.time_date) == query_date
        ).all()

        # Extract taken times
        taken_times = [service.time_date.time() for service in taken_slots]

        # Generate all possible times within the working hours
        current_time = datetime.combine(query_date, start_time)
        end_datetime = datetime.combine(query_date, end_time)
        available_times = []

        while current_time <= end_datetime:
            if current_time.time() not in taken_times:
                available_times.append(current_time.time().strftime('%H:%M'))
            current_time += time_interval

        return jsonify({"available_times": available_times}), 200

    except Exception as e:
        app.logger.error(f"Error fetching available times: {e}")
        return jsonify({"error": "An error occurred", "details": str(e)}), 500



@app.route('/update-vehicle-status', methods=['POST'])
def update_vehicle_status():
    data = request.json
    vehicleVIN = data.get('VIN')
    new_status = data.get('status')
    print(data)

    try:
        print(f"Searching for vehicle with VIN: {vehicleVIN}")
        vehicle = Vehicle.query.filter_by(VIN=vehicleVIN).first()

        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404

        vehicle.status = new_status
        db.session.commit()

        return jsonify({"message": "Vehicle status updated successfully"}), 200

    except Exception as e:
        app.logger.error(f"Error updating vehicle status: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
if __name__ == '__main__':
    print("main")
    app.run(host="0.0.0.0", port=5001, debug=True)