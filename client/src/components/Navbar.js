import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: 'white', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaGraduationCap />
            Course Certificates
          </Link>
          
          <div className="d-flex align-items-center gap-3">
            <Link to="/courses" style={{ 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: '500'
            }}>
              Courses
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/certificates" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  My Certificates
                </Link>
                <Link to="/generate-certificate" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Generate Certificate
                </Link>
                <div className="d-flex align-items-center gap-2" style={{ color: 'white' }}>
                  <FaUser />
                  <span>{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-light">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 