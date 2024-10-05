import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import moonImage from "../assets/earth1.png";


const getRandomBoxShadow = (n) => {
  let shadows = [];
  for (let i = 0; i < n; i++) {
    const offsetX = Math.random() * 2000 + "px";
    const offsetY = Math.random() * 2000 + "px";
    shadows.push(`${offsetX} ${offsetY} #FFF`);
  }
  return shadows.join(", ");
};

const AuthPage = () => {
  
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

  return (
    <div className="background-container">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div>
        <img src={moonImage} alt="moon" className="moon-image" />
      </div>


      <div className="">
     
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

export default AuthPage;







