from flask import Flask, render_template,request,jsonify
import requests
from weather1 import getweather
import pickle
import json
app=Flask(__name__)
with open('flood_model1.pkl','rb') as f:
        model = pickle.load(f)

@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/calculate',methods=['POST'])
def calculate():
     data = request.get_json()
     city=data.get('city')
     weather=getweather(city)
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
     return jsonify({"result":label})



@app.route('/predict')
def predict():
    return render_template('Predict.html')

if __name__=='__main__':
    app.run(debug=True,port=5000)