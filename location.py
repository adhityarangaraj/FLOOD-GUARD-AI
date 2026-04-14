from geopy.geocoders import Nominatim

# Initialize Nominatim API (user_agent is required)
geolocator = Nominatim(user_agent="my_location")

def locate(city):
    location_name = city
    location = geolocator.geocode(location_name)
    if location:
        return [location.latitude, location.longitude]
    else:
        return None
