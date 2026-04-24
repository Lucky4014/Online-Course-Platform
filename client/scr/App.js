import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import Learning from './pages/Learning';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:token" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/course/:id" element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/learn/:enrollmentId" element={
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;