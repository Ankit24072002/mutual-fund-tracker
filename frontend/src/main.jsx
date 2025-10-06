import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Saved from './pages/Saved';
import Compare from './pages/Compare';
import bgImage from './assets/bg-funds.jpg';
import './styles.css';

function App() {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('email');
    return email ? { email } : null;
  });

  const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true');

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDark(prev => {
      localStorage.setItem('dark', !prev);
      return !prev;
    });
  };

  return (
    <BrowserRouter>
      {/* Background */}
      <div
        className="min-h-screen relative transition-colors duration-300"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

        {/* Main content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-sky-700 dark:text-sky-400 mb-2 md:mb-0">
              Mutual Fund Tracker
            </h1>
            <nav className="flex gap-4 items-center flex-wrap">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sky-800 dark:text-sky-300 font-semibold'
                    : 'text-sky-600 hover:underline'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/compare"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sky-800 dark:text-sky-300 font-semibold'
                    : 'text-sky-600 hover:underline'
                }
              >
                Compare
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    to="/saved"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-sky-800 dark:text-sky-300 font-semibold'
                        : 'text-sky-600 hover:underline'
                    }
                  >
                    Saved
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md border border-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="text-sky-600 hover:underline">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="text-sky-600 hover:underline">
                    Register
                  </NavLink>
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className="ml-4 px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {dark ? '🌙 Dark' : '☀️ Light'}
              </button>
            </nav>
          </header>

          {/* Routes */}
          <div className="max-w-5xl mx-auto space-y-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="/register" element={<Register onLogin={setUser} />} />
              <Route path="/saved" element={<Saved user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
