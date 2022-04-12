import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import Main from './pages/Main';
import Dashboard from './pages/Dashboard';
import ClientOrders from './pages/OrdersClient';

import './index.css';

function App(props) {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-orders" element={<ClientOrders />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
