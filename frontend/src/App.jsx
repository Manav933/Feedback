import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

axios.defaults.baseURL = API_BASE_URL

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  )

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    document.documentElement.classList.toggle('dark-mode', darkMode)
  }, [token, darkMode])

  const handleLogin = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('token', accessToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
  }

  if (!token) {
    return (
      <div className="app">
        <Toaster position="top-right" />
        {showRegister ? (
          <Register onLogin={handleLogin} onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    )
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      <Dashboard user={user} onLogout={handleLogout} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
    </div>
  )
}

export default App

