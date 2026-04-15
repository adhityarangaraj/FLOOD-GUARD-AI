from flask import Flask, render_template,request,jsonify
import requests
from weather1 import getweather_city,getweather_coord
import pickle
import json
from error import cityError,serverError
app=Flask(__name__)
with open('flood_model1.pkl','rb') as f:
        model = pickle.load(f)

@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/calculate',methods=['POST'])
def calculate():
     data = request.get_json()
     print(data)
     city=data.get('city')
     if data.get('lat') and data.get('lon'):
          lat=data.get('lat')
     
          try:
               weather=getweather_coord(lat,lon)
          except serverError as e:
               return jsonify({"result": str(e), "type":2}),400
     elif data.get('city'):
          try:
               weather=getweather_city(city)
          except serverError as e:
               return jsonify({"result": str(e),"type":2}),400
          except cityError as e:
               return jsonify({"result":str(e),"type":1}),400

          weather=getweather_coord(lat,lon)
     elif data.get('city'):
          weather=getweather_city(city)
     else:
          return jsonify({"result":"invalid city input is given"}),400
     if weather is None:
          return jsonify({"result":"Server error ,unable to fetch api"}),400
     print(weather)

     rain=weather[0][0]
     prediction = model.predict_proba(weather)[0][1]
     risk_percent=round(prediction*100,2)
     risk_percent = min(risk_percent + rain * 0.5, 100)
     if risk_percent<10:
          label="LOW RISK!!!"
     elif risk_percent<70:
          label="MODERATE RISK!!!"
     else:
          label="SEVERE RISK!!!"
     return jsonify({"result":label}),200



@app.route('/predict')
def predict():
    return render_template('Predict.html')

if __name__=='__main__':
    app.run(debug=True,port=5000)