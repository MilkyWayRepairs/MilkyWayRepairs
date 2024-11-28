# Refer to README under flask-backend directory to setup backend 
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
# from flask_session import Session
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from models import db, User, Review, Message, Vehicle, Service, Job, Log, Appointments
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

# Database configuration should come BEFORE app.config.from_object
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("PERSONAL_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

# Then load additional config
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)
with app.app_context():
    db.create_all()

# Add debug route
@app.route('/')
def home():
    return jsonify({
        "message": "Server is running",
        "status": "ok"
    })

# Add a separate database test endpoint
@app.route('/db-test')
def db_test():
    try:
        # Modern way to get table names
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        return jsonify({
            "message": "Database connected",
            "tables": tables,
            "database_uri": app.config['SQLALCHEMY_DATABASE_URI']
        })
    except Exception as e:
        return jsonify({
            "error": "Database connection failed",
            "details": str(e)
        }), 500

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
@app.route('/chat', methods=['POST'])
def get_or_create_chat():
    try:
        data = request.json
        sender_id = str(data['sender_id'])
        receiver_id = str(data['receiver_id'])

        # Debug prints
        print(f"Creating chat between sender {sender_id} and receiver {receiver_id}")
        print(f"Using Sendbird App ID: {SENDBIRD_APP_ID}")
        print(f"Headers: {HEADERS}")

        # Create unique channel URL (sort IDs to ensure consistency)
        channel_url = f'channel_{min(sender_id, receiver_id)}_{max(sender_id, receiver_id)}'
        
        create_channel_url = f'https://api-{SENDBIRD_APP_ID}.sendbird.com/v3/group_channels'
        
        payload = {
            'user_ids': [sender_id, receiver_id],
            'is_distinct': True,
            'channel_url': channel_url,
            'name': f'Chat between {sender_id} and {receiver_id}'
        }

        response = requests.post(create_channel_url, headers=HEADERS, json=payload)
        
        # Debug response
        print(f"Sendbird Response Status: {response.status_code}")
        print(f"Sendbird Response: {response.text}")

        if response.status_code in [200, 201]:
            return jsonify({
                'message': 'Chat created successfully',
                'channel_url': channel_url
            }), 200
        else:
            return jsonify({
                'error': 'Failed to create chat',
                'details': response.text,
                'status': response.status_code
            }), response.status_code

    except Exception as e:
        print(f"Error in get_or_create_chat: {str(e)}")  # Debug print
        return jsonify({
            'error': 'Server error',
            'details': str(e)
        }), 500


      
# Endpoint to create a new chat if it doesn't exist
@app.route('/start_chat', methods=['POST'])
def start_chat():
    data = request.json
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']

    # Fetch all messages between the sender and receiver
    messages = Message.query.filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    ).order_by(Message.timestamp).all()

    message_list = [
        {
            'message_id': msg.message_id,
            'sender_id': msg.sender_id,
            'receiver_id': msg.receiver_id,
            'content': msg.content,
            'timestamp': msg.timestamp.isoformat()
        } for msg in messages
    ]

    return jsonify({'messages': message_list}), 200

@app.route('/messages', methods=['POST'])
def send_message():
    try:
        data = request.json
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        content = data.get('content')

        if not all([sender_id, receiver_id, content]):
            return jsonify({'error': 'Missing required fields'}), 400

        new_message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content
        )
        
        db.session.add(new_message)
        db.session.commit()

        return jsonify({
            'id': new_message.message_id,
            'content': new_message.content,
            'sender': str(new_message.sender_id),
            'timestamp': new_message.timestamp.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error sending message: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/messages', methods=['GET'])
def get_messages():
    try:
        sender_id = request.args.get('sender_id')
        receiver_id = request.args.get('receiver_id')
        
        if not sender_id or not receiver_id:
            return jsonify({'error': 'Missing sender_id or receiver_id'}), 400

        print(f"Fetching messages between {sender_id} and {receiver_id}")

        messages = Message.query.filter(
            db.or_(
                db.and_(Message.sender_id == sender_id, Message.receiver_id == receiver_id),
                db.and_(Message.sender_id == receiver_id, Message.receiver_id == sender_id)
            )
        ).order_by(Message.timestamp.asc()).all()

        print(f"Found {len(messages)} messages")

        messages_list = [{
            'id': msg.message_id,  # Use message_id consistently
            'message_id': msg.message_id,  # Include both for compatibility
            'content': msg.content,
            'sender': str(msg.sender_id),
            'timestamp': msg.timestamp.isoformat()
        } for msg in messages]

        return jsonify(messages_list), 200

    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return jsonify({'error': str(e)}), 500

#select user to start chatting
@app.route('/users', methods=['GET'])
def get_users():
    try:
        # Fetch all users except the current logged-in user
        users = User.query


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
        app.logger.error(f"Error updating vehicle status: {e}")
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
    
    
@app.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs = Job.query.all()
        print(f"Found {len(jobs)} jobs")  # Debug print
        
        jobs_list = [{
            'job_id': job.job_id,
            'service_id': job.service_id,
            'rating': float(job.rating) if job.rating else None,
            'feedback': job.feedback or f"Job {job.job_id}"  # Use feedback if available, otherwise use job ID
        } for job in jobs]
        
        return jsonify(jobs_list)
    except Exception as e:
        print(f"Error in jobs endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add a debug endpoint
@app.route('/debug/jobs')
def debug_jobs():
    try:
        # Direct database query
        result = db.session.execute("SELECT * FROM job").fetchall()
        return jsonify({
            "raw_count": len(result),
            "raw_data": [dict(row) for row in result]
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/logs', methods=['POST'])
def submit_log():
    if not session.get("id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    try:
        # Verify that the job exists
        job = Job.query.get(data['jobTitle'])  # Now jobTitle contains the job_id
        if not job:
            return jsonify({"error": "Invalid job selected"}), 400

        new_log = Log(
            date=data['date'],
            mileage=data['mileage'],
            vin=data['vin'],
            job_title=data['jobTitle'],  # This is now the job_id
            job_notes=data['jobNotes'],
            user_id=str(session.get("id"))
        )
        db.session.add(new_log)
        db.session.commit()
        return jsonify({"message": "Log submitted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        logs = Log.query.all()
        logs_list = [{
            'id': log.id,
            'date': log.date,
            'mileage': log.mileage,
            'vin': log.vin,
            'jobTitle': log.job_title,  # This is the job_id
            'jobNotes': log.job_notes
        } for log in logs]
        return jsonify(logs_list)
    except Exception as e:
        print("Error fetching logs:", str(e))
        return jsonify({"error": "Failed to fetch logs"}), 500

@app.route('/test', methods=['GET'])
def test():
    print("Test endpoint hit!")  # Debug print
    return jsonify({"message": "Server is working!"})

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("id", None)
    return "200"


if __name__ == '__main__':
    print("main")
    app.run(host="0.0.0.0", port=5001, debug=True)

