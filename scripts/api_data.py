from pymongo import MongoClient
import requests
from requests.auth import HTTPBasicAuth
from flask import Flask, jsonify
import threading
import time

app = Flask(__name__)

def fetch_weather_data(lat, lon, minlat, minlon, maxlat, maxlon):
    current_time = "2024-10-05T00:00:00Z"
    api_url = f"https://api.meteomatics.com/{current_time}/t_2m:C/{minlat},{minlon}:{maxlat},{maxlon}:0.02,0.04/html"
    username = "batool_bisra"
    password = "Lobp17YH5K"

    try:
        response = requests.get(api_url, auth=HTTPBasicAuth(username, password))
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return None, None, None, None, None

    api_url = f"https://api.meteomatics.com/{current_time}/t_2m:C,precip_1h:mm,wind_speed_10m:ms/{lat},{lon}/json"
    try:
        response = requests.get(api_url, auth=HTTPBasicAuth(username, password))
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching detailed weather data: {e}")
        return None, None, None, None

    try:
        data = response.json()
    except ValueError as e:
        print(f"Error decoding JSON: {e}")
        return None, None, None, None

    temperature, wind_speed, wind_dir, precip = None, None, None, None
    for entry in data['data']:
        if entry['parameter'] == 't_2m:C':
            temperature = entry['coordinates'][0]['dates'][0]['value']
        elif entry['parameter'] == 'wind_speed_10m:ms':
            wind_speed = entry['coordinates'][0]['dates'][0]['value']
        elif entry['parameter'] == 'wind_dir_10m:d':
            wind_dir = entry['coordinates'][0]['dates'][0]['value']
        elif entry['parameter'] == 'precip_1h:mm':
            precip = entry['coordinates'][0]['dates'][0]['value']

    return temperature, wind_speed, wind_dir, precip


def fetch_all_users_data():
    MONGO_URI = "mongodb+srv://duresameen32:ZrPtbRFKmjZCD8hh@cluster0.kilku.mongodb.net/nasadata?retryWrites=true&w=majority&appName=Cluster0"
    try:
        client = MongoClient(MONGO_URI)
        db = client['nasadata']
        collection = db['datas']
        records = collection.find()
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

    if collection.count_documents({}) > 0:
        for record in records:
            lon = record.get('lon')
            lat = record.get('lat')
            minlat = record.get('minlat')
            minlon = record.get('minlon')
            maxlat = record.get('maxlat')
            maxlon = record.get('maxlon')
            name = record.get('name')
            userId = record.get('userId')

            temperature, wind_speed, wind_dir, precip = fetch_weather_data(lat, lon, minlat, minlon, maxlat, maxlon)

            if all(v is not None for v in [temperature, wind_speed, wind_dir, precip]):
                try:
                    collection.update_one(
                        {'userId': userId},
                        {
                            '$set': {
                                'temperature': temperature,
                                'wind_speed': wind_speed,
                                'wind_dir': wind_dir,
                                'precip': precip,
                            }
                        }
                    )
                    print(f"Updated user {userId} with weather data.")
                except Exception as e:
                    print(f"Error updating user {userId} in MongoDB: {e}")

            print(f"User Details:\nLongitude: {lon}\nLatitude: {lat}\nMin Latitude: {minlat}\nMin Longitude: {minlon}\nMax Latitude: {maxlat}\nMax Longitude: {maxlon}\nName: {name}\nUser ID: {userId}")
            print("-" * 40)
    else:
        print("No records found")


@app.route('/fetch-weather-data', methods=['POST'])
def fetch_weather_data_api():
    fetch_all_users_data()
    return jsonify({"status": "success", "message": "Weather data fetched"}), 200


def watch_user_collection():
    MONGO_URI = "mongodb://duresameen32:ZrPtbRFKmjZCD8hh@cluster0.kilku.mongodb.net/nasadata?retryWrites=true&w=majority&appName=Cluster0"
    try:
        client = MongoClient(MONGO_URI)
        db = client['nasadata']
        collection = db['datas']

        print('Watching for new entries in the user collection...')
        last_checked_count = collection.count_documents({})
        
        while True:
            current_count = collection.count_documents({})
            if current_count > last_checked_count:
                print("New user entry detected.")
                fetch_all_users_data()
                last_checked_count = current_count
            time.sleep(10)  # Check every 10 seconds
    except Exception as e:
        print(f"Error watching user collection: {e}")


if __name__ == "__main__":
    threading.Thread(target=lambda: app.run(port=5000)).start()
    watch_user_collection()
