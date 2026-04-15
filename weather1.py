import requests
from location import locate
from error import cityError,serverError
def getweather_coord(lat,lon):
    coordinates=[lat,lon]
    if coordinates is None:
        return None
    url = f"https://api.open-meteo.com/v1/forecast?latitude={coordinates[0]}&longitude={coordinates[1]}&hourly=precipitation,soil_moisture_0_to_1cm&forecast_days=1"
    try:
        response = requests.get(url)
        if response.status_code!=200:
            raise serverError('Unable to fetch weather info!!')
        data=response.json()
        if data is None:
            raise serverError('Unable to fetch weather info!!')
        rain = sum(data['hourly']['precipitation'])
        soil = data['hourly']['soil_moisture_0_to_1cm'][-1]* 100
        return [(rain,soil,min(data['elevation'],45))] 
    except:
        raise serverError('Unable to fetch weather info!!')
def getweather_city(city):
    try:
        lat,lon=locate(city)
    except cityError:
        raise cityError('Invalid City Name')
    # if lat is None or lon is None:
    #     return None
    return getweather_coord(lat,lon)




