import React from "react";
import Marketplace from "./Pages/Marketplace";
import Navbar from "./components/Navbar";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import Learn from "./Pages/Learn";
import Contact from "./Pages/Contact";
import Orders from "./Pages/Orders";
import CompanyDetails from "./Pages/CompanyDetails";
import { useSelector } from "react-redux";

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/learn" element={<Learn/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/marketplace" element={<Marketplace/>}/>
          <Route path="/marketplace/:slug" element={<CompanyDetails/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
