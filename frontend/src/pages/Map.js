import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import markerIcon from "../assets/marker.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
// import moonImage from "../assets/earth1.png";

const getRandomBoxShadow = (n) => {
  let shadows = [];
  for (let i = 0; i < n; i++) {
    const offsetX = Math.random() * 2000 + "px";
    const offsetY = Math.random() * 2000 + "px";
    shadows.push(`${offsetX} ${offsetY} #FFF`);
  }
  return shadows.join(", ");
};

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UpdateMapCenter = ({ coordinates, setBounds }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const minLat = bounds.getSouthWest().lat;
      const maxLat = bounds.getNorthEast().lat;
      const minLng = bounds.getSouthWest().lng;
      const maxLng = bounds.getNorthEast().lng;

      setBounds({ minLat, maxLat, minLng, maxLng });
    },
  });

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 13);
    }
  }, [coordinates, map]);

  return null;
};

const Map = () => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shadows-small",
      getRandomBoxShadow(700)
    );
    document.documentElement.style.setProperty(
      "--shadows-medium",
      getRandomBoxShadow(200)
    );
    document.documentElement.style.setProperty(
      "--shadows-big",
      getRandomBoxShadow(100)
    );
  }, []);

  const [locations, setLocations] = useState({
    name: "",
    coordinates: { lat: 51.505, lng: -0.09 },
  });
  const [inputLocations, setInputLocations] = useState("");
  const [bounds, setBounds] = useState({
    minLat: null,
    maxLat: null,
    minLng: null,
    maxLng: null,
  });

  const fetchLocation = async () => {
    try {
      const res = await axios.get("http://localhost:5000/locations", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      if (res.data.length > 0) {
        const lastLocation = res.data[0];
        setLocations({
          name: lastLocation.name,
          coordinates: { lat: lastLocation.lat, lng: lastLocation.lon },
        });
        setInputLocations(lastLocation.name);
      }
    } catch (error) {
      console.error(
        "Error fetching location:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${inputLocations}`
      );
      const { lat, lon } = res.data[0];
      const coordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

      setLocations({ name: inputLocations, coordinates });

      await axios.post(
        "http://localhost:5000/locations",
        {
          name: inputLocations,
          lat: coordinates.lat,
          lon: coordinates.lng,
          minlat: bounds.minLat,
          minlon: bounds.minLng,
          maxlat: bounds.maxLat,
          maxlon: bounds.maxLng,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      await axios.post(
        "http://localhost:5000/datas",
    
       {name: inputLocations,
        lat: coordinates.lat,
        lon: coordinates.lng,
        minlat: bounds.minLat,
        minlon: bounds.minLng,
        maxlat: bounds.maxLat,
        maxlon: bounds.maxLng,},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div className="background-container">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      {/* <div>
        <img src={moonImage} alt="moon" className="moon-image" />
      </div> */}
      <div className="">
        <div className="map-container">
          <div className="map-search-bar">
            <input
              type="text"
              value={inputLocations}
              onChange={(e) => setInputLocations(e.target.value)}
              placeholder="Search locations..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              SEARCH
            </button>
          </div>
          <MapContainer
            center={[locations.coordinates.lat, locations.coordinates.lng]}
            zoom={13}
            className="leaflet-map"
          >
            <TileLayer
              url="
https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=40edc45213c54421a6b3e4598aa52dab"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker
              position={[locations.coordinates.lat, locations.coordinates.lng]}
              icon={customIcon}
            />
            <UpdateMapCenter coordinates={locations.coordinates} setBounds={setBounds} />
          </MapContainer>
          <div className="locations-info">
            <p>
              <strong>Location:</strong> {locations.name}
            </p>
            <p>
              <strong>Coordinates:</strong> Lat: {locations.coordinates.lat},
              Lng: {locations.coordinates.lng}
            </p>
            <p>
              <strong>Bounds:</strong>
              <br />
              Min Lat: {bounds.minLat}, Max Lat: {bounds.maxLat}
              <br />
              Min Lng: {bounds.minLng}, Max Lng: {bounds.maxLng}
            </p>
            <button className="view_btn">
    <a href="/data">View Data</a>
  </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
