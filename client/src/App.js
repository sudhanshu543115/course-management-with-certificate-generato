import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Certificates from './components/Certificates';
import CertificateGenerator from './components/CertificateGenerator';
import Loading from './components/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route 
            path="/certificates" 
            element={
              <PrivateRoute>
                <Certificates />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/generate-certificate" 
            element={
              <PrivateRoute>
                <CertificateGenerator />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App; 