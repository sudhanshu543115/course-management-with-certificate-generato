const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate Certificate
router.post('/generate', auth, async (req, res) => {
  try {
    const { courseId, studentName } = req.body;

    if (!courseId || !studentName) {
      return res.status(400).json({ message: 'Course ID and student name are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    const hasCompleted = user.completedCourses.find(
      completed => completed.courseId.toString() === courseId
    );

    if (!hasCompleted) {
      return res.status(400).json({ message: 'Course must be completed before generating certificate' });
    }

    const existingCertificate = await Certificate.findOne({
      userId: req.user.id,
      courseId: courseId
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already exists for this course' });
    }

    const certificate = new Certificate({
      userId: req.user.id,
      courseId,
      studentName: studentName,
      courseTitle: course.title,
      instructorName: course.instructor,
      completionDate: new Date()
    });

    await certificate.save();

    const pdfPath = await generateCertificatePDF(certificate, course);

    certificate.certificateUrl = pdfPath;
    await certificate.save();

    res.json({
      message: 'Certificate generated successfully',
      certificate,
      downloadUrl: `/api/certificates/download/${certificate._id}`
    });

  } catch (error) {
    console.error('Certificate Generation Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download certificate
router.get('/download/:certificateId', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.certificateId,
      userId: req.user.id
    });

    if (!certificate || !certificate.certificateUrl) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const filePath = path.join(__dirname, '..', certificate.certificateUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }

    res.download(filePath, `certificate-${certificate._id}.pdf`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate PDF
async function generateCertificatePDF(certificate, course) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

      const certificatesDir = path.join(__dirname, '..', 'certificates');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const fileName = `certificate-${certificate._id}.pdf`;
      const filePath = path.join(certificatesDir, fileName);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Simple Certificate Design
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#007bff');
      doc.fontSize(48).font('Helvetica-Bold').fill('#007bff').text('Certificate of Completion', 0, 120, { align: 'center' });
      doc.fontSize(24).fill('#6c757d').text('This is to certify that', 0, 200, { align: 'center' });
      doc.fontSize(36).fill('#212529').text(certificate.studentName, 0, 250, { align: 'center' });
      doc.fontSize(18).fill('#6c757d').text('has successfully completed the course', 0, 320, { align: 'center' });
      doc.fontSize(28).fill('#007bff').text(course.title, 0, 360, { align: 'center' });
      doc.fontSize(16).fill('#6c757d').text(`Instructor: ${course.instructor}`, 0, 420, { align: 'center' });
      doc.fontSize(16).text(`Completed on: ${new Date(certificate.completionDate).toLocaleDateString()}`, 0, 450, { align: 'center' });
      doc.fontSize(12).fill('#adb5bd').text(`Certificate ID: ${certificate.certificateId || certificate._id}`, 0, 500, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`certificates/${fileName}`);
      });
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = router;
