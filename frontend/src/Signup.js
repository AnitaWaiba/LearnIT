import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import axios from 'axios';
import './Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();  // ✅ Initialize the navigation hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            setMessage('Signup successful! Redirecting to login...');

            // ✅ Reset the form fields
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });

            // ✅ Redirect to login page after 2 seconds (optional delay)
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error(error.response);
            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group password-field">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div className="form-group password-field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className="password-input-container">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button type="submit">Signup</button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Signup;