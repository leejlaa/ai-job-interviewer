import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="text-xl font-bold tracking-wide">
            <Link to="/" className="hover:text-gray-300">Smart Interview</Link>
          </div>

          {/* Links */}
          <div className="hidden sm:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/interview" className="hover:text-gray-300">Interview</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            {!token && (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </>
            )}
            {token && (
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
