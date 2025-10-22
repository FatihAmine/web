// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import Newuser from "./pages/auth/NewUser";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import GestionUtilisateursAdmin from "./pages/admin/GestionUtilisateursAdmin";
import GestionDocumentsAdmin from "./pages/admin/GestionDocumentsAdmin";
import JournalisationAdmin from "./pages/admin/JournalisationAdmin";
import NotificationsAdmin from "./pages/admin/NotificationsAdmin";

// Etudiant
import EtudiantHome from "./pages/user/etudiant/EtudiantHome";
import DemandesEtudiants from "./pages/user/etudiant/DemandesEtudiants";
import DocumentEtudiants from "./pages/user/etudiant/DocumentEtudiants";
import NotificationsEtudiants from "./pages/user/etudiant/NotificationsEtudiants";
import ParamètresEtudiants from "./pages/user/etudiant/ParametresEtudiants";

// Parent
import ParentHome from "./pages/user/parent/ParentHome";
import DemandesParents from "./pages/user/parent/DemandesParents";
import DocumentParents from "./pages/user/parent/DocumentParents.jsx";
import EtudiantsParents from "./pages/user/parent/EtudiantsParents.jsx";
import NotificationsParents from "./pages/user/parent/NotificationsParents";
import ParamètresParents from "./pages/user/parent/ParametresParents.jsx";

// Personnel
import PersonnelHome from "./pages/user/personnel/PersonnelHome";
import DocumentPersonnel from "./pages/user/personnel/DocumentPersonnel";
import NotificationsPersonnel from "./pages/user/personnel/NotificationsPersonnel";
import ParamètresPersonnel from "./pages/user/personnel/ParametresPersonnel";

// Guards
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-user" element={<Newuser />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protégées: il faut être connecté */}
        <Route element={<RequireAuth />}>
          {/* Admin-only */}
          <Route element={<RequireRole allow={['admin']} />}>
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/admin/gestion-utilisateurs" element={<GestionUtilisateursAdmin />} />
            <Route path="/admin/gestion-documents" element={<GestionDocumentsAdmin />} />
            <Route path="/admin/journalisation" element={<JournalisationAdmin />} />
            <Route path="/admin/notifications" element={<NotificationsAdmin />} />
          </Route>

          {/* Étudiant-only */}
          <Route element={<RequireRole allow={['etudiant']} />}>
            <Route path="/etudiant" element={<EtudiantHome />} />
            <Route path="/etudiant/demandes" element={<DemandesEtudiants />} />
            <Route path="/etudiant/documents" element={<DocumentEtudiants />} />
            <Route path="/etudiant/notifications" element={<NotificationsEtudiants />} />
            <Route path="/etudiant/settings" element={<ParamètresEtudiants />} />
          </Route>

          {/* Parent-only */}
          <Route element={<RequireRole allow={['parent']} />}>
            <Route path="/parent" element={<ParentHome />} />
            <Route path="/parent/demandes" element={<DemandesParents />} />
            <Route path="/parent/documents" element={<DocumentParents />} />
            <Route path="/parent/children" element={<EtudiantsParents />} />
            <Route path="/parent/notifications" element={<NotificationsParents />} />
            <Route path="/parent/settings" element={<ParamètresParents />} />
          </Route>

          {/* Personnel-only */}
          <Route element={<RequireRole allow={['personnel']} />}>
            <Route path="/personnel" element={<PersonnelHome />} />
            <Route path="/personnel/documents" element={<DocumentPersonnel />} />
            <Route path="/personnel/notifications" element={<NotificationsPersonnel />} />
            <Route path="/personnel/settings" element={<ParamètresPersonnel />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
