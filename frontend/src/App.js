import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from  "./pages/Home";
import Map from "./pages/Map"
function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Register />} />
       <Route path="/Home" element={<Home/>}/>
        <Route path="/Map" element={<Map/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;