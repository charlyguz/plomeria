import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import DashboardCliente from './Dashboard/DashboardCliente';
import DashboardTecnico from './Dashboard/DashboardTecnico';
import DashboardGerente from './Dashboard/DashboardGerente/DashboardGerente';
import Register from './Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/cliente" element={<DashboardCliente />} />
        <Route path="/dashboard/tecnico" element={<DashboardTecnico />} />
        <Route path="/dashboard/gerente/*" element={<DashboardGerente />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
