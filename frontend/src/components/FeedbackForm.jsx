import React, { useState } from 'react';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: '',
    rating: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (starValue) => {
    setFormData({ ...formData, rating: starValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://mockinterview-2-gxs9.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for your feedback!');
        setFormData({ name: '', email: '', comments: '', rating: 0 });
      } else {
        alert('Error submitting feedback: ' + data.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('There was a problem submitting your feedback.');
    }
  };

  return (
    <div className="feedback-container">
      <h2>We Value Your Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Rate Our App</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= formData.rating ? 'star filled' : 'star'}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        <label>Additional Comments</label>
        <textarea
          name="comments"
          rows="4"
          value={formData.comments}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
