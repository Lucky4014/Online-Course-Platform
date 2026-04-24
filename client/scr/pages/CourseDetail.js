import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RazorpayButton from './RazorpayButton';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <img src={course.thumbnail} className="img-fluid mb-3" alt={course.title} />
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <p><strong>Price:</strong> ₹{course.price}</p>
          <p><strong>Instructor:</strong> {course.instructor}</p>
          <p><strong>Level:</strong> {course.level} | <strong>Category:</strong> {course.category}</p>
          
          <RazorpayButton courseId={course._id} amount={course.price} />
        </div>
        
        <div className="col-md-4">
          <h4>Curriculum</h4>
          {course.modules.map((module, mIndex) => (
            <div key={mIndex} className="mb-3 p-3 border rounded">
              <h6>{module.title}</h6>
              <ul className="list-unstyled">
                {module.lessons.map((lesson, lIndex) => (
                  <li key={lIndex} className="small text-muted">▶ {lesson.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;