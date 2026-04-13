import requests
from location import locate
def getweather(city):
    coordinates=locate(city)
    url = f"https://api.open-meteo.com/v1/forecast?latitude={coordinates[0]}&longitude={coordinates[1]}&hourly=precipitation,soil_moisture_0_to_1cm&forecast_days=1"
    response = requests.get(url)
    data=response.json()
    rain = sum(data['hourly']['precipitation'])
    soil = data['hourly']['soil_moisture_0_to_1cm'][-1]* 100
    return [(rain,soil,min(data['elevation'],45))]     


