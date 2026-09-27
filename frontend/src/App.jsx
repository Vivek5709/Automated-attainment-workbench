import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Portal from "./components/Portal";
import ReportFormat from "./components/ReportFormat";


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/portal" element={<Portal />} />

        <Route
  path="/reportformat"
  element={<ReportFormat />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;