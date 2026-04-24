import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    const res = await axios.get('/api/enrollments/my');
    setEnrollments(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get('/api/courses');
    setCourses(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.name}!</h2>
      
      <div className="row">
        <div className="col-md-8">
          <h4>My Courses</h4>
          <div className="row">
            {enrollments.map(enrollment => (
              <div key={enrollment._id} className="col-md-6 mb-3">
                <div className="card">
                  <img src={enrollment.course.thumbnail || '/placeholder.jpg'} className="card-img-top" alt="course" />
                  <div className="card-body">
                    <h5 className="card-title">{enrollment.course.title}</h5>
                    <p className="card-text">Progress: {enrollment.progress}%</p>
                    <Link to={`/learn/${enrollment._id}`} className="btn btn-primary">Continue Learning</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-md-4">
          <h4>Available Courses</h4>
          <div className="list-group">
            {courses.slice(0, 5).map(course => (
              <Link key={course._id} to={`/course/${course._id}`} className="list-group-item list-group-item-action">
                {course.title} - ₹{course.price}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;