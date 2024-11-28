from dotenv import load_dotenv
import os
import redis

load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv("PERSONAL_URI")

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")

    SENDBIRD_API_TOKEN = os.getenv("SENDBIRD_API_TOKEN")
    SENDBIRD_APP_ID = os.getenv("SENDBIRD_APP_ID")
    HEADERS = {
    'Content-Type': 'application/json',
    'Api-Token': SENDBIRD_API_TOKEN
}

