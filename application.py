import os
import json
import requests
from redirector import *
from flask import Flask, jsonify, session, render_template, request, redirect, url_for, Markup
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

votes = {"yes": 0, "no": 0, "maybe": 0}

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

@app.route("/")
@login_required
def index():
    return render_template("index.html", votes=votes)


@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    votes[selection] += 1
    emit("vote totals", votes, broadcast=True)

#if __name__ == '__main__':
#    app.debug = True
#    app.run(port=8080)

@app.route("/login", methods=["GET","POST"])
def login():
    login_message=''
    if request.method=="POST":
            user_register = request.form.get('user_register')
            password_register = request.form.get('password_register')
            user_login = request.form.get('user_login')
            password_login = request.form.get('password_login')


            if user_login==None:
                usedusername = db.execute("SELECT * FROM users WHERE username = :username",{"username":user_register}).fetchone()
                if usedusername != None:
                    login_message= "Sorry this username already exists!"
                    return render_template('login.html', login_message=login_message)
                else:
                    db.execute("INSERT INTO users (username, password) VALUES (:username,:password)",{"username":user_register,"password":password_register})
                    db.commit()
                    login_message = "Great username! You can login now."   

            else:       #log in 
                check_user = db.execute("SELECT username, password FROM users WHERE username = :username", {"username" : user_login}).fetchone()
                if check_user != None:
                    if check_user.username == user_login and check_user.password == password_login:
                        session["username"]=user_login
                        return redirect(url_for("index"))
                    else:
                        login_message = "Wrong username or password!"   
                else:
                    login_message= "Wrong username or password!"
    return render_template('login.html', login_message=login_message)                        
            
     
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")