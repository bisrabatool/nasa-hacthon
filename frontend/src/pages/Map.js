import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import './Map.css'; 
import 'leaflet/dist/leaflet.css'; 
import markerIcon from '../assets/marker.png';


const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UpdateMapCenter = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 13);
    }
  }, [coordinates, map]);

  return null;
};

const Map = () => {
  const [locations, setLocations] = useState({ name: '', coordinates: { lat: 51.505, lng: -0.09 } });
  const [inputLocations, setInputLocations] = useState('');

  const fetchLocation = async () => {
    try {
      const res = await axios.get('http://localhost:5000/locations', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (res.data.length > 0) {
        const lastLocation = res.data[0];
        setLocations({
          name: lastLocation.name,
          coordinates: { lat: lastLocation.lat, lng: lastLocation.lon }
        });
        setInputLocations(lastLocation.name);
      }
    } catch (error) {
      console.error('Error fetching location:', error.response ? error.response.data : error.message);
    }
  };
  

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${inputLocations}`);
      const { lat, lon } = res.data[0];
      const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

      setLocations({ name: inputLocations, coordinates });

      await axios.post('http://localhost:5000/locations', {
        name: inputLocations,
        lat: coordinates.lat,
        lng: coordinates.lng
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div className="map-container">
      <div className="map-search-bar">
        <input
          type="text"
          value={inputLocations}
          onChange={(e) => setInputLocations(e.target.value)}
          placeholder="Search locations..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <MapContainer center={[locations.coordinates.lat, locations.coordinates.lng]} zoom={13} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[locations.coordinates.lat, locations.coordinates.lng]} icon={customIcon} />
        <UpdateMapCenter coordinates={locations.coordinates} />
      </MapContainer>
      <div className="locations-info">
        <p><strong>Location:</strong> {locations.name}</p>
        <p><strong>Coordinates:</strong> Lat: {locations.coordinates.lat}, Lng: {locations.coordinates.lng}</p>
      </div>
    </div>
  );
};

export default Map;
