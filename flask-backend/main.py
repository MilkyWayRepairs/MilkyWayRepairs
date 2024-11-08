from flask import Flask 
from flaskext.mysql import MySQL
mysql = MySQL()

app = Flask(__name__)
mysql.init_app(app)


cursor = mysql.get_db().cursor()

# Members API Route

@app.route("/members")

def members():
    return {"members": ["jason" , "kevin" , "lance" ,"caleb a" , "caleb l" , "bahran" ,  "moises" , "alex"]}


if __name__ == "__main__":
    app.run(debug=True)