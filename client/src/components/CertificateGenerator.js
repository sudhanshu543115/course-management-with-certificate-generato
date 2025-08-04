import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { FaCertificate, FaDownload, FaUser, FaGraduationCap } from 'react-icons/fa';

const CertificateGenerator = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompletedCourses();
    if (user?.name) {
      setStudentName(user.name);
    }
  }, [user]);

  const fetchCompletedCourses = async () => {
    try {
      const response = await axios.get('/api/courses/user/completed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompletedCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch completed courses');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !studentName.trim()) {
      toast.error('Please select a course and enter your name');
      return;
    }

    setGenerating(true);
    try {
      const response = await axios.post('/api/certificates/generate', {
        courseId: selectedCourse,
        studentName: studentName.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Certificate generated successfully!');
      
      // Download the certificate
      const downloadUrl = response.data.downloadUrl;
      window.open(downloadUrl, '_blank');
      
      // Navigate to certificates page
      navigate('/certificates');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (completedCourses.length === 0) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="text-center">
            <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>
              <FaGraduationCap />
            </div>
            <h2>No Completed Courses</h2>
            <p className="text-muted mb-4">
              You need to complete at least one course before you can generate a certificate.
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="btn btn-primary"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ fontSize: '3rem', color: '#007bff', marginBottom: '1rem' }}>
            <FaCertificate />
          </div>
          <h1>Generate Certificate</h1>
          <p className="text-muted">
            Create a professional certificate for your completed course
          </p>
        </div>

        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleGenerateCertificate}>
            <div className="form-group">
              <label className="form-label">
                <FaUser style={{ marginRight: '8px' }} />
                Your Name (as it should appear on certificate)
              </label>
              <input
                type="text"
                className="form-control"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaGraduationCap style={{ marginRight: '8px' }} />
                Select Completed Course
              </label>
              <select
                className="form-control"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Choose a course...</option>
                {completedCourses.map((completed) => (
                  <option key={completed.courseId._id} value={completed.courseId._id}>
                    {completed.courseId.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={generating}
            >
              <FaDownload style={{ marginRight: '8px' }} />
              {generating ? 'Generating Certificate...' : 'Generate Certificate'}
            </button>
          </form>
        </div>

        {/* Completed Courses List */}
        <div className="mt-5">
          <h3 className="text-center mb-4">Your Completed Courses</h3>
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            {completedCourses.map((completed) => (
              <div key={completed.courseId._id} className="card" style={{ width: '300px' }}>
                <img
                  src={completed.courseId.image}
                  alt={completed.courseId.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {completed.courseId.title}
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {completed.courseId.instructor}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <FaGraduationCap style={{ color: '#28a745' }} />
                    <span style={{ color: '#28a745', fontSize: '0.9rem' }}>
                      Completed on {new Date(completed.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator; 