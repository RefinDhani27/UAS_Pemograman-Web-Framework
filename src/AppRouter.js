import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';

const AppRouter = ({ isLoggedIn, handleLogin, handleRegister, handleLogout }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/home" element={isLoggedIn ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/add-book" element={isLoggedIn ? <AddBook /> : <Navigate to="/" />} />
        <Route path="/update-book/:id/:uid" element={isLoggedIn ? <UpdateBook /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
