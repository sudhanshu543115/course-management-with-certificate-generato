import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaCertificate, FaUsers, FaBook } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Welcome to Course Certificate System
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Complete courses, earn certificates, and showcase your achievements
          </p>
          {!isAuthenticated ? (
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/register" className="btn btn-light btn-lg">
                Get Started
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/courses" className="btn btn-light btn-lg">
                Browse Courses
              </Link>
              <Link to="/certificates" className="btn btn-outline-light btn-lg">
                View Certificates
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Our Platform?</h2>
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            <div className="card" style={{ width: '300px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#007bff', marginBottom: '1rem' }}>
                <FaGraduationCap />
              </div>
              <h3>Quality Courses</h3>
              <p className="text-muted">
                Access a wide range of high-quality courses designed by industry experts
              </p>
            </div>
            
            <div className="card" style={{ width: '300px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#28a745', marginBottom: '1rem' }}>
                <FaCertificate />
              </div>
              <h3>Earn Certificates</h3>
              <p className="text-muted">
                Get professional certificates upon course completion to boost your career
              </p>
            </div>
            
            <div className="card" style={{ width: '300px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#ffc107', marginBottom: '1rem' }}>
                <FaUsers />
              </div>
              <h3>Learn Together</h3>
              <p className="text-muted">
                Join a community of learners and share your progress with others
              </p>
            </div>
            
            <div className="card" style={{ width: '300px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}>
                <FaBook />
              </div>
              <h3>Flexible Learning</h3>
              <p className="text-muted">
                Learn at your own pace with 24/7 access to course materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#f8f9fa',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p className="text-muted mb-4">
            Join thousands of learners who have already earned their certificates
          </p>
          <Link to="/courses" className="btn btn-primary btn-lg">
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 