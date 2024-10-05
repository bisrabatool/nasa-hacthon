import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import "./data.css";

const getRandomBoxShadow = (n) => {
  let shadows = [];
  for (let i = 0; i < n; i++) {
    const offsetX = Math.random() * 2000 + "px";
    const offsetY = Math.random() * 2000 + "px";
    shadows.push(`${offsetX} ${offsetY} #FFF`);
  }
  return shadows.join(", ");
};

const DataPage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/datas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          setError("No data found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No data found</div>;
  }

  return (
    <div className="background-container">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <div className="table-container">
        <p className="table_head">Location Data</p>
        <div className="vertical-table">
          <div>Name</div><div>{userData.name}</div>
          <div>Latitude</div><div>{userData.lat}</div>
          <div>Longitude</div><div>{userData.lon}</div>
          <div>Min Latitude</div><div>{userData.minlat}</div>
          <div>Min Longitude</div><div>{userData.minlon}</div>
          <div>Max Latitude</div><div>{userData.maxlat}</div>
          <div>Max Longitude</div><div>{userData.maxlon}</div>
          <div>Temperature (°C)</div><div>{userData.tempreture}</div>
          <div>Wind Speed (m/s)</div><div>{userData.wind_speed}</div>
          <div>Precipitation (mm)</div><div>{userData.precip}</div>
          <div>Wind Direction (°)</div><div>{userData.wind_dir}</div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default DataPage;
