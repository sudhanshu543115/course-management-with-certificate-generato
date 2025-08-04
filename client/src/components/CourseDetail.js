import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { FaUser, FaClock, FaStar, FaCheck, FaPlay, FaList, FaBook } from 'react-icons/fa';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to complete courses');
      return;
    }

    setCompleting(true);
    try {
      await axios.post(`/api/courses/${id}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Course completed successfully! You can now generate a certificate.');
      fetchCourse(); // Refresh course data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete course');
    } finally {
      setCompleting(false);
    }
  };

  const isCompleted = user?.completedCourses?.some(
    completed => completed.courseId === id
  );

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Course Header */}
        <div className="card mb-4">
          <div className="d-flex flex-wrap gap-4">
            <img
              src={course.image}
              alt={course.title}
              style={{
                width: '300px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div className="d-flex gap-2 mb-2">
                <span className={`badge badge-${course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'warning' : 'danger'}`}>
                  {course.level}
                </span>
                <span className="badge badge-primary">{course.category}</span>
              </div>
              
              <h1 style={{ marginBottom: '1rem' }}>{course.title}</h1>
              <p className="text-muted mb-3">{course.description}</p>
              
              <div className="d-flex align-items-center gap-4 mb-3">
                <div className="d-flex align-items-center gap-1">
                  <FaUser style={{ color: '#6c757d' }} />
                  <span style={{ color: '#6c757d' }}>{course.instructor}</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <FaClock style={{ color: '#6c757d' }} />
                  <span style={{ color: '#6c757d' }}>{course.duration}</span>
                </div>
              </div>
              
              {isAuthenticated && (
                <div className="d-flex gap-2">
                  {isCompleted ? (
                    <div className="d-flex align-items-center gap-2">
                      <FaCheck style={{ color: '#28a745' }} />
                      <span style={{ color: '#28a745', fontWeight: '500' }}>
                        Course Completed
                      </span>
                      <Link to="/generate-certificate" className="btn btn-success">
                        Generate Certificate
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleCompleteCourse}
                      className="btn btn-primary"
                      disabled={completing}
                    >
                      <FaStar style={{ marginRight: '8px' }} />
                      {completing ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="d-flex flex-wrap gap-4">
          {/* Main Content */}
          <div style={{ flex: '2', minWidth: '300px' }}>
            <div className="card mb-4">
              <h3 className="mb-3">
                <FaPlay style={{ marginRight: '8px' }} />
                Course Content
              </h3>
              {course.content && course.content.length > 0 ? (
                <div>
                  {course.content.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-3 mb-3 p-3" style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: '1' }}>
                        <h5 style={{ margin: '0', fontSize: '1rem' }}>{item.title}</h5>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#6c757d' }}>
                          {item.description}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Course content will be available soon.</p>
              )}
            </div>

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="card mb-4">
                <h3 className="mb-3">
                  <FaBook style={{ marginRight: '8px' }} />
                  What You'll Learn
                </h3>
                <ul style={{ listStyle: 'none', padding: '0' }}>
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="d-flex align-items-start gap-2 mb-2">
                      <FaCheck style={{ color: '#28a745', marginTop: '4px', flexShrink: '0' }} />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ flex: '1', minWidth: '250px' }}>
            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="card mb-4">
                <h4 className="mb-3">
                  <FaList style={{ marginRight: '8px' }} />
                  Requirements
                </h4>
                <ul style={{ listStyle: 'none', padding: '0' }}>
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="mb-2">
                      • {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Info */}
            <div className="card">
              <h4 className="mb-3">Course Information</h4>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#6c757d' }}>Level:</span>
                <span>{course.level}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#6c757d' }}>Category:</span>
                <span>{course.category}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#6c757d' }}>Duration:</span>
                <span>{course.duration}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{ color: '#6c757d' }}>Instructor:</span>
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 