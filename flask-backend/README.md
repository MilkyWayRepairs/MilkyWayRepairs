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
$ pip install Flask flask_sqlalchemy pymysql
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
$ pip install Flask flask_sqlalchemy pymysql
 ```

- jason