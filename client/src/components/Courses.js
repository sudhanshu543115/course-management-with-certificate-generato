import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { FaSearch, FaClock, FaUser, FaStar, FaPlay } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async (courseId) => {
    if (!isAuthenticated) {
      toast.error('Please login to complete courses');
      return;
    }

    try {
      await axios.post(`/api/courses/${courseId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Course marked as completed!');
      fetchCourses(); // Refresh courses
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete course');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1>Available Courses</h1>
          <p className="text-muted">Explore our comprehensive course catalog</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
            
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              className="form-control"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center">
            <h3>No courses found</h3>
            <p className="text-muted">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-4">
            {filteredCourses.map(course => (
              <div key={course._id} className="card" style={{ width: '350px' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge badge-${course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'warning' : 'danger'}`}>
                      {course.level}
                    </span>
                    <span className="badge badge-primary">{course.category}</span>
                  </div>
                  
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                    {course.title}
                  </h3>
                  
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    {course.description.substring(0, 100)}...
                  </p>
                  
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="d-flex align-items-center gap-1">
                      <FaUser style={{ color: '#6c757d' }} />
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        {course.instructor}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <FaClock style={{ color: '#6c757d' }} />
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        {course.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Link to={`/courses/${course._id}`} className="btn btn-primary flex-fill">
                      <FaPlay style={{ marginRight: '8px' }} />
                      View Course
                    </Link>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleCompleteCourse(course._id)}
                        className="btn btn-success"
                        title="Mark as completed"
                      >
                        <FaStar />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 