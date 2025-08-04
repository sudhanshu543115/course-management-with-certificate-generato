import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { FaCertificate, FaDownload, FaCalendar, FaIdCard } from 'react-icons/fa';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCertificates(response.data);
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const response = await axios.get(`/api/certificates/download/${certificateId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div style={{ fontSize: '3rem', color: '#007bff', marginBottom: '1rem' }}>
            <FaCertificate />
          </div>
          <h1>My Certificates</h1>
          <p className="text-muted">
            View and download your earned certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center">
            <div style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}>
              <FaCertificate />
            </div>
            <h3>No Certificates Yet</h3>
            <p className="text-muted mb-4">
              Complete courses to earn your first certificate!
            </p>
            <button 
              onClick={() => window.location.href = '/courses'}
              className="btn btn-primary"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="card" style={{ width: '400px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '12px 12px 0 0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    <FaCertificate />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Certificate of Completion</h3>
                  <p style={{ opacity: 0.9, margin: '0' }}>
                    {certificate.courseTitle}
                  </p>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div className="mb-3">
                    <h4 style={{ marginBottom: '0.5rem' }}>{certificate.studentName}</h4>
                    <p className="text-muted" style={{ margin: '0' }}>
                      has successfully completed the course
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FaIdCard style={{ color: '#6c757d' }} />
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        ID: {certificate.certificateId}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendar style={{ color: '#6c757d' }} />
                      <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        Issued: {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(certificate.certificateId)}
                    className="btn btn-primary w-100"
                  >
                    <FaDownload style={{ marginRight: '8px' }} />
                    Download Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates; 