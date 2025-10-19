import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login"; // Login
import AdminLogin from "./pages/admin/auth/AdminLogin"; // AdminAuth

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard"; // AdminHome
import DemandesAdmin from "./pages/admin/DemandesAdmin"; // AdminRequests
import GestionUtilisateursAdmin from "./pages/admin/GestionUtilisateursAdmin"; // AdminUsers
import GestionDocumentsAdmin from "./pages/admin/GestionDocumentsAdmin"; // AdminDocuments
import JournalisationAdmin from "./pages/admin/JournalisationAdmin"; // AdminLogs
import NotificationsAdmin from "./pages/admin/NotificationsAdmin"; // AdminNotifications
import ParamètresAdmin from "./pages/admin/ParamètresAdmin"; // AdminSettings
import SécuritéAdmin from "./pages/admin/SécuritéAdmin"; // AdminSecurity
import BaseDeDonnéesAdmin from "./pages/admin/BaseDeDonnéesAdmin"; // AdminDatabase
import StatistiquesAdmin from "./pages/admin/StatistiquesAdmin"; // AdminStats
// Etudiant
import EtudiantHome from "./pages/user/etudiant/EtudiantHome"; // StudentDashboard
import DemandesEtudiants from "./pages/user/etudiant/DemandesEtudiants"; // StudentRequests
import DocumentEtudiants from "./pages/user/etudiant/DocumentEtudiants"; // StudentDocuments
import TeleverserEtudiants from "./pages/user/etudiant/TeleverserEtudiants"; // StudentUpload
import NotificationsEtudiants from "./pages/user/etudiant/NotificationsEtudiants"; // StudentNotifications
import ParamètresEtudiants from "./pages/user/etudiant/ParametresEtudiants"; // StudentSettings

// Parents
import ParentHome from "./pages/user/parent/ParentHome"; // ParentDashboard
import DemandesParents from "./pages/user/parent/DemandesParents"; // ParentRequests
import DocumentParents from "./pages/user/parent/DocumentParents.jsx"; // ParentDocuments
import EtudiantsParents from "./pages/user/parent/EtudiantsParents.jsx"; // ParentStudents
import NotificationsParents from "./pages/user/parent/NotificationsParents";
import ParamètresParents from "./pages/user/parent/ParametresParents.jsx"; // ParentSettings
// Personnel
import PersonnelHome from "./pages/user/personnel/PersonnelHome"; // PersonnelDashboard
import DemandesPersonnel from "./pages/user/personnel/DemandesPersonnel";  // PersonnelRequests
import DocumentPersonnel from "./pages/user/personnel/DocumentPersonnel"; // PersonnelDocuments
import EtudiantsPersonnel from "./pages/user/personnel/EtudiantsPersonnel"; // PersonnelStudents
import NotificationsPersonnel from "./pages/user/personnel/NotificationsPersonnel"; // PersonnelNotifications
import ParamètresPersonnel from "./pages/user/personnel/ParametresPersonnel"; // PersonnelSettings  

function App() {
  return (
    <Router>
      <Routes>
        {/* Start at Login */}
        <Route path="/" element={<Login />} />
        {/* Admin  */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/demandes" element={<DemandesAdmin />} />
        <Route path="/admin/gestion-utilisateurs" element={<GestionUtilisateursAdmin />} />
        <Route path="/admin/gestion-documents" element={<GestionDocumentsAdmin />} />
        <Route path="/admin/journalisation" element={<JournalisationAdmin />} />
        <Route path="/admin/notifications" element={<NotificationsAdmin />} />
        <Route path="/admin/parametres" element={<ParamètresAdmin />} />
        <Route path="/admin/securite" element={<SécuritéAdmin />} />
        <Route path="/admin/base-de-donnees" element={<BaseDeDonnéesAdmin />} />
        <Route path="/admin/statistiques" element={<StatistiquesAdmin />} />
        
        {/* Etudiant */}
        <Route path="/etudiant" element={<EtudiantHome />} />
        <Route path="/etudiant/demandes" element={<DemandesEtudiants />} />
        <Route path="/etudiant/documents" element={<DocumentEtudiants />} />
        <Route path="/etudiant/upload" element={<TeleverserEtudiants />} />
        <Route path="/etudiant/notifications" element={<NotificationsEtudiants />} />
        <Route path="/etudiant/settings" element={<ParamètresEtudiants />} />
        {/* Parent  */}
        <Route path="/parent" element={<ParentHome />} />
        <Route path="/parent/demandes" element={<DemandesParents />} />
        <Route path="/parent/documents" element={<DocumentParents />} />
        <Route path="/parent/children" element={<EtudiantsParents />} />
        <Route path="/parent/notifications" element={<NotificationsParents />} />
        <Route path="/parent/settings" element={<ParamètresParents />} />
        {/* Personnel  */}
        <Route path="/personnel" element={<PersonnelHome />} />
        <Route path="/personnel/demandes" element={<DemandesPersonnel />} />
        <Route path="/personnel/documents" element={<DocumentPersonnel />} />
        <Route path="/personnel/students" element={<EtudiantsPersonnel />} />
        <Route path="/personnel/notifications" element={<NotificationsPersonnel />} />
        <Route path="/personnel/settings" element={<ParamètresPersonnel />} />


        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
