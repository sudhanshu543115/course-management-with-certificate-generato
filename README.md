# Course Certificate System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing courses and generating completion certificates. Users can browse courses, mark them as completed, and generate downloadable PDF certificates.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Course Management**: Browse, search, and filter courses by category and level
- **Course Completion**: Mark courses as completed to track progress
- **Certificate Generation**: Generate professional PDF certificates for completed courses
- **Certificate Management**: View and download earned certificates
- **Responsive Design**: Modern, mobile-friendly UI with beautiful gradients
- **Real-time Validation**: Form validation and error handling
- **Secure API**: JWT authentication and protected routes

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **PDFKit** - PDF generation
- **Express Validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-certificate-system
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/course-certificate-system
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

   **Note**: Replace `your_jwt_secret_key_here_change_in_production` with a strong secret key for production.

5. **Database Setup**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in your `.env` file.

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm run client
   ```
   The React app will run on `http://localhost:3000`

3. **Or run both simultaneously**
   ```bash
   npm run dev
   ```

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/complete` - Mark course as completed (protected)
- `GET /api/courses/user/completed` - Get user's completed courses (protected)

### Certificates
- `POST /api/certificates/generate` - Generate certificate (protected)
- `GET /api/certificates/download/:id` - Download certificate (protected)
- `GET /api/certificates/user` - Get user's certificates (protected)
- `GET /api/certificates/verify/:id` - Verify certificate (public)

## Project Structure

```
course-certificate-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── ...
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Course.js
│   └── Certificate.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── courses.js
│   └── certificates.js
├── middleware/             # Custom middleware
│   └── auth.js
├── certificates/           # Generated PDF certificates
├── server.js              # Main server file
├── package.json
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Browse Courses**: View available courses with search and filter options
3. **Complete Courses**: Mark courses as completed to track your progress
4. **Generate Certificates**: Create professional PDF certificates for completed courses
5. **Download Certificates**: Download and save your certificates locally

## Sample Data

The application starts with an empty database. You can add sample courses through the API or create an admin user to manage courses through the interface.

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

## Future Enhancements

- Email notifications for certificate generation
- Course ratings and reviews
- Advanced certificate templates
- Bulk certificate generation
- Admin dashboard for course management
- Social sharing of certificates
- Certificate verification QR codes 