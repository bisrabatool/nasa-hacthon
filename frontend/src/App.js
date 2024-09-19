import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/register";
import Login from "./pages/Login";
import Home from  "./pages/Home";
import Map from "./pages/Map"
function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route path="/Home" element={<Home/>}/>
        <Route path="/register" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Map" element={<Map/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;