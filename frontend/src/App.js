import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Home from  "./pages/Home";
import Map from "./pages/Map"
import Data from "./pages/data";
function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Register />} />
       <Route path="/Home" element={<Home/>}/>
        <Route path="/Map" element={<Map/>}/>
        <Route path="/data" element={<Data/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;