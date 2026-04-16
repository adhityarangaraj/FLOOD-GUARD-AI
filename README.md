FloodGuard AI

   FloodGuard AI is a machine learning-powered web application that predicts flood risk using real-time weather data and geographic inputs.

Features

City-based Prediction
 Enter a city name to assess flood risk.

Map-based Selection
 Select any location on an interactive map using latitude and longitude.

Real-time Weather Integration
 Retrieves live environmental data including:

          Rainfall
          Soil moisture
          Elevation

Machine Learning Model
 Predicts flood probability based on weather conditions.

Risk Classification

 Low Risk
 Moderate Risk
 Severe Risk
How It Works
 User Input
 City name OR
 Coordinates via map selection
Backend Processing
 Converts city to coordinates (if needed)
 Fetches real-time weather data
 Extracts relevant features
Model Prediction
 Machine learning model estimates flood probability
Risk Evaluation
 Rainfall is incorporated as an additional factor
Output
 Final risk level displayed to the user

Tech Stack

Frontend

 HTML
 CSS
 JavaScript
 Leaflet.js

Backend

 Python
 Flask

Machine Learning

 Scikit-learn
 Pandas
 NumPy

APIs

 Open-Meteo API
 Geopy

Installation & Setup
 
 Clone the repository

 git clone https://github.com/your-username/floodguard-ai.git
 cd floodguard-ai
 
Install dependencies

 pip install flask requests geopy scikit-learn
 
Run the application

python app.py

Open in browser
 http://127.0.0.1:5000/

Future Scope
 Real-time flood alerts
 Risk heatmaps
 Integration with live data sources
 Improved model accuracy

