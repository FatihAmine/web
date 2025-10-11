import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EtudiantHome from "./pages/user/etudiant/EtudiantHome";
import ParentHome from "./pages/user/parent/ParentHome";
import PersonnelHome from "./pages/user/personnel/PersonnelHome";

function App() {
  return (
    <Router>
      <Routes>
        {/* Start at Login */}
        <Route path="/" element={<Login />} />
        {/* Admin / Login Page */}
        <Route path="/admin" element={<AdminLogin />} />
        {/* Dashboard / home routes */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/etudiant" element={<EtudiantHome />} />
        <Route path="/parent" element={<ParentHome />} />
        <Route path="/personnel" element={<PersonnelHome />} />

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
