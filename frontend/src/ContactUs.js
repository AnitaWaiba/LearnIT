import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent! \n\n${JSON.stringify(formData, null, 2)}`);

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="form-section">
        <h2>Get in touch</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="info-section">
        <h2>Contact us</h2>
        <ul>
          <li>
            <span className="icon">📍</span>
            <span><b>Address:</b> Kathmandu, Nepal</span>
          </li>
          <li>
            <span className="icon">📞</span>
            <span><b>Phone:</b>01-2503542</span>
          </li>
          <li>
            <span className="icon">✉️</span>
            <span><b>Email:</b>learnIT@gmail.com</span>
          </li>
          <li>
            <span className="icon">🌐</span>
            <span><b>Website:</b> learnIT.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContactUs;