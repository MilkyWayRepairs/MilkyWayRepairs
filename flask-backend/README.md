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
$ pip install Flask flask_sqlalchemy pymysql python-dotenv flask-cors dnspython
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
$ pip install Flask flask_sqlalchemy pymysql python-dotenv flask-cors
 ```


## Set Up .env File

 1) create .env file under flask-backend
 2) Create environment variable as shown below, but sqlusername and password are our own database access accounts
 ```
 PERSONAL_URI='mysql+pymysql://sqlusername:sqlpassword@ipaddress:3306/milkywayrepairs'
 ```