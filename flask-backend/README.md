# Flask Setup

## Windows
1) Create an environment
 ```
$ cd MilkyWayRepairs\flask-backend\
$ py -3 -m venv .venv
 ```
2) Activate the environment
 ```
$ if not using bash:
$ .venv\Scripts\activate
$ if using bash:
$ .venv/Scripts/activate
 ```

### Note : Python must be installed onto your computer, and Python MUST be added to PATH 
3) Install Flask
 ```
$ pip install Flask flask_sqlalchemy pymysql python-dotenv flask-cors dnspython flask-session redis flask-bcrypt cryptography
 ```

## MacOS / Linux

1) Create an environment
 ```
$ cd /MilkyWayRepairs/flask-backend
$ python3 -m venv .venv
 ```
2) Activate the environment
 ```
$ .venv/bin/activate
 ```

### Note : Python must be installed onto your computer, and Python MUST be added to PATH 
3) Install Flask
 ```
$ pip install Flask flask_sqlalchemy pymysql python-dotenv flask-cors dnspython
 ```


## Set Up .env File

 1) create .env file under flask-backend
 2) Create environment variable as shown below, but sqlusername and password are our own database access accounts
 ```
 PERSONAL_URI='mysql+pymysql://sqlusername:sqlpassword@ipaddress:3306/milkywayrepairs'
 SECRET_KEY='literallyAnyStringICreatedMineRandomlyAsA24BitStringInPython'
 SENDBIRD_API_TOKEN = '535316c4d3c3642958f0a25ffc8f6e6021489437'
 SENDBIRD_APP_ID = "5D0726A7-302C-4867-867E-ED5500933EC8"
 ```

 # Twilio setup Instructions
 https://www.twilio.com/docs/messaging/quickstart/python

 1) add the following lines to your .env

 TWILIO_ACCOUNT_SID = 'AC3a0c2cdd8522abaac2ab4887479e0587'
 TWILIO_AUTH_TOKEN = '56a53b18df3596b0cda0b2327e68f257'


 2)  pip install twilio