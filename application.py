import os
import json
import requests
from redirector import *
from flask import Flask, jsonify, session, render_template, request, redirect, url_for, Markup
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels={}  
channels['General']=[] 
# channels['chanel1']=[]
# limit=100
# count = 0
# message={'msg':"hello  world",'usr':'andro'}
# channels['General'].append(message)
# print(channels['General'][count]['msg'])

    

@app.route("/")
def index():
    return render_template("index.html")


count=0
@socketio.on('message')
def handleMessage(data):    
    message={'msg':data["msg"], 'usr':data["usr"]}
    channels['General'].append(message)
    print(channels['General'])    
    emit('displayMessage', channels['General'], broadcast=True)

@socketio.on('onemessage')
def one_message(x):
    message = {'msg':x["msg"], 'usr':x["usr"]}
    channels['General'].append(message)
    print(channels)
    emit('showOneMessage', x, broadcast=True)

@socketio.on('new_channel')
def handleNewChannel(data):
    channels[data]=[]
    print(channels)
    emit('add_new_channel', data, broadcast=True)    

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0")

if __name__ == '__main__':
   app.debug = True
   app.run(port=5026)