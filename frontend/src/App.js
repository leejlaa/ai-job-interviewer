import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import InterviewPage from './components/InterviewPage';
import Navbar from './components/Navbar';
import { useAuth } from './components/AuthContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1 className="text-3xl font-bold text-center mt-10">Welcome to Smart Interview</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Inline Protected Route */}
        <Route
          path="/interview"
          element={user ? <InterviewPage /> : <Navigate to="/login" replace />}
        />

        {/* You can add other public routes here */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
