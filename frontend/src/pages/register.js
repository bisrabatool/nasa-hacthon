import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import myImage from "../assets/nasa_logo.png";
import moonImage from "../assets/earth1.png";
import google from "../assets/google_icon.png";
import { useNavigate } from "react-router-dom";

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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";
    try {
      const res = await axios.post(url, { email, password });
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/Home");
      } else {
        toast.success("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(`${isLogin ? "Login" : "Signup"} failed`);
    }
  };

  const handleGoogleAuth = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

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

      {/* Form Container */}
      <div className="login-container">
        <div className="login-box">
          <div className="login_logo">
            <img src={myImage} alt="Logo" height={150} />
          </div>

          {/* Toggle Between Login and Signup */}
          {isLogin ? (
            <>
              <h2  className="login_logo">LOGIN</h2>
              <form onSubmit={handleAuth}>
                <div className="login_input-container">
                  <i className="fa-regular fa-user" id="login_icons"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="login_input-container">
                  <i className="fa-solid fa-lock" id="login_icons"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="login_forgot-link">Forgot Password?</div>
                <button type="submit" className="login-button">
                  Login
                </button>
                <img src={google} alt="" className="google_icons" height={30} />
                <button
                  onClick={handleGoogleAuth}
                  type="button"
                  className="google-button"
                >
                  Login with Google
                </button>
                <div className="login-line">
                  <p>
                    Don't have an account?{" "}
                    <a
                      href="#"
                      className="login-link"
                      onClick={() => setIsLogin(false)}
                    >
                      Signup{" "}
                    </a>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2  className="login_logo">SIGNUP</h2>
              <form className="signin_form" onSubmit={handleAuth}>
                <div className="signin_input-container">
                  <i className="fa-regular fa-user" id="signin_icons"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="signin_input-container">
                  <i className="fa-solid fa-lock" id="signin_icons"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="signin-button">
                  Signup
                </button>
                <div className="signin-line">
                  <p>
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="signin-link"
                      onClick={() => setIsLogin(true)}
                    >
                      LOGIN
                    </a>
                  </p>
                </div>
              </form>
            </>
          )}
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

export default AuthPage;
