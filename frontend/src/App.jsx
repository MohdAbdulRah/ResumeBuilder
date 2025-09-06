import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeView from "./pages/ResumeView";
import ResumeEdit from "./pages/ResumeEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>

        <Route path="/resume/:id" element={<ResumeView />} />     {/* view resume */}
        <Route path="/resume/edit/:id" element={<ResumeEdit />} />  { /*resumeedit*/}
      </Routes>
    </BrowserRouter>
  );
}


