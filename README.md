🌊 FloodGuard AI

FloodGuard AI is a machine learning-powered web application that predicts flood risk using real-time weather data and geographic inputs.

🚀 Features

 🌍 **City-based Prediction**
  Enter a city name to assess flood risk.

📍 **Map-based Selection**
  Select any location on an interactive map using latitude and longitude.

☁️ **Real-time Weather Integration**
  Retrieves live environmental data including:

  * Rainfall
  * Soil moisture
  * Elevation

 🤖 **Machine Learning Model**
  Predicts flood probability based on weather conditions.

 ⚠️ **Risk Classification**

  * 🟢 Low Risk
  * 🟡 Moderate Risk
  * 🔴 Severe Risk


🧠 How It Works

1. User provides:

   * City name **OR**
   * Coordinates via map selection

2. Backend processing:

   * Converts city to coordinates (if needed)
   * Fetches real-time weather data
   * Extracts relevant features

3. Model prediction:

   * Machine learning model estimates flood probability

4. Risk evaluation:

   * Rainfall is incorporated as an additional factor

5. Output:

   * Final risk level displayed to the user

---

🏗️ Tech Stack

Frontend

* HTML, CSS, JavaScript
* Leaflet.js

Backend

* Python
* Flask

Machine Learning

* Scikit-learn
* Pandas
* Numpy

APIs

* Open-Meteo API
* Geopy

⚙️ Installation & Setup

1. Clone the repository


git clone https://github.com/your-username/floodguard-ai.git
cd floodguard-ai


2. Install dependencies


pip install flask requests geopy scikit-learn


3. Run the application


python app.py


 4. Open in browser


http://127.0.0.1:5000/




🔌 API Endpoint

`POST /calculate`

Request Body:

json
{
  "city": "Chennai"
}


OR

json
{
  "lat": 13.0827,
  "lon": 80.2707
}


 Response:

json
{
  "result": "SEVERE RISK!!!"
}




 🔮 Future Scope

* Real-time flood alerts
* Risk heatmaps
* Integration with live data sources
* Improved model accuracy


