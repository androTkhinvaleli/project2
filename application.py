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
channelsList=[]
limit=100


    

@app.route("/")
def index():
    return render_template("index.html")


@socketio.on('message')
def handleMessage(data):    
    message={'msg':data["msg"], 'usr':data["usr"], 'channel':data["channel"]}
    print(data["channel"])
    channels[data["channel"]].append(message)
    activeChannel=channels[data["channel"]]
    if len(channels[data["channel"]])>limit:
        channels[data["channel"]].pop(0)
    print(channels)    
    emit('displayMessage', {'activeChannel':activeChannel, 'channelsList':channelsList}, broadcast=True)

@socketio.on('onemessage')
def one_message(x):
    message = {'msg':x["msg"], 'usr':x["usr"], 'channel':x["channel"] }
    print(x["channel"])
    channels[x["channel"]].append(message)
    if len(channels[x["channel"]])>limit:
        channels[x["channel"]].pop(0)
    print(channels)
    emit('showOneMessage', x, broadcast=True)

@socketio.on('new_channel')
def handleNewChannel(data):
    channels[data]=[]
    channelsList.append(data)
    print(channelsList)
    emit('add_new_channel', data, broadcast=True)


@socketio.on('active_channel_messages')
def all_mesages(t):
    message={'msg':t["msg"], 'usr':t["usr"], 'channel':t["channel"]}
    print(t["channel"])
    channels[t["channel"]].append(message)
    if len(channels[t["channel"]])>limit:
        channels[t["channel"]].pop(0)
    activeChannel=channels[t["channel"]]
    emit('showChannelMessages', activeChannel, broadcast=True)

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0")

if __name__ == '__main__':
   app.debug = True
   app.run(port=5000)