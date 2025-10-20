import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import { Bell, Users, FileText, Clock, TrendingUp, Activity, X, Menu } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/admin/AdminDashboard.css';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

// Sample data for charts
const lineChartData = [
  { name: 'Jan', users: 400, documents: 240 },
  { name: 'Fév', users: 300, documents: 139 },
  { name: 'Mar', users: 200, documents: 980 },
  { name: 'Avr', users: 278, documents: 390 },
  { name: 'Mai', users: 189, documents: 480 },
  { name: 'Jun', users: 239, documents: 380 },
  { name: 'Jul', users: 349, documents: 430 },
];

const pieChartData = [
  { name: 'Actif', value: 400, color: '#17766e' },
  { name: 'En attente', value: 300, color: '#f59e0b' },
  { name: 'Inactif', value: 200, color: '#ef4444' },
  { name: 'Suspendu', value: 100, color: '#64748b' },
];

const barChartData = [
  { name: 'Lun', requests: 45 },
  { name: 'Mar', requests: 52 },
  { name: 'Mer', requests: 38 },
  { name: 'Jeu', requests: 63 },
  { name: 'Ven', requests: 48 },
  { name: 'Sam', requests: 25 },
  { name: 'Dim', requests: 20 },
];

const recentActivities = [
  { id: 1, user: 'Sarah Martin', action: 'Document téléchargé', time: 'Il y a 2 min', type: 'upload' },
  { id: 2, user: 'John Doe', action: 'Inscription plateforme', time: 'Il y a 15 min', type: 'user' },
  { id: 3, user: 'Emma Wilson', action: "Demande d'accès", time: 'Il y a 1h', type: 'request' },
  { id: 4, user: 'Mike Johnson', action: 'Profil mis à jour', time: 'Il y a 2h', type: 'update' },
  { id: 5, user: 'Alice Cooper', action: 'Nouveau document créé', time: 'Il y a 3h', type: 'upload' },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    {
      id: 1,
      title: 'Total Utilisateurs',
      value: '1,254',
      change: '+12.5%',
      icon: <Users size={24} />,
      color: '#5eead4',
    },
    {
      id: 2,
      title: 'Documents',
      value: '340',
      change: '+8.2%',
      icon: <FileText size={24} />,
      color: '#3b82f6',
    },
    {
      id: 3,
      title: 'En attente',
      value: '12',
      change: '-2.4%',
      icon: <Clock size={24} />,
      color: '#f59e0b',
    },
    {
      id: 4,
      title: 'Croissance',
      value: '+18%',
      change: '+5.1%',
      icon: <TrendingUp size={24} />,
      color: '#10b981',
    },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Ouvrir/Fermer Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Tableau de bord</h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {/* Stats Cards */}
          <div className="admin-stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="admin-stat-card" style={{'--stat-color': stat.color}}>
                <div className="stat-icon" style={{background: `${stat.color}1a`, color: stat.color}}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change" style={{color: stat.change.startsWith('+') ? '#10b981' : '#ef4444'}}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="admin-charts-grid">
            {/* Area Chart */}
            <div className="admin-chart-card">
              <div className="chart-header">
                <h2 className="chart-title">Aperçu de la croissance</h2>
                <select className="chart-filter">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>12 derniers mois</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#17766e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#17766e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                    labelStyle={{color: '#fff'}}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="users" stroke="#17766e" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} name="Utilisateurs" />
                  <Area type="monotone" dataKey="documents" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDocs)" strokeWidth={3} name="Documents" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="admin-chart-card">
              <h2 className="chart-title">Statut des utilisateurs</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                    labelStyle={{color: '#fff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieChartData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{backgroundColor: entry.color}}></span>
                    <span className="legend-text">{entry.name}</span>
                    <span className="legend-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart and Activity */}
          <div className="admin-bottom-grid">
            {/* Bar Chart */}
            <div className="admin-chart-card">
              <h2 className="chart-title">Demandes hebdomadaires</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                    labelStyle={{color: '#fff'}}
                  />
                  <Bar dataKey="requests" fill="#17766e" radius={[8, 8, 0, 0]} name="Demandes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="admin-chart-card">
              <h2 className="chart-title">Activité récente</h2>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <Activity size={20} />
                    </div>
                    <div className="activity-details">
                      <p className="activity-user">{activity.user}</p>
                      <p className="activity-action">{activity.action}</p>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
