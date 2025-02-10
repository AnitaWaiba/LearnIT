import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OpeningPage.css';

function OpeningPage() {
    const navigate = useNavigate();
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Show dashboard when the user scrolls down even a little
                setShowDashboard(true);
            } else {
                setShowDashboard(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="opening-page">
            {/* Floating Dashboard appears when user scrolls */}
            {showDashboard && (
                <div className="floating-dashboard">
                    <h2 className="dashboard-logo">LearnIT</h2>
                    <button className="dashboard-btn" onClick={() => navigate('/signup')}>
                        Get Started
                    </button>
                </div>
            )}

            {/* Header Section */}
            <header className="header">
                <h1>LearnIT</h1>
            </header>

            {/* Main Content Section */}
            <main className="main-content">
                <div className="content-container">
                    {/* Image Section */}
                    <div className="image-section">
                        <img
                            src="https://via.placeholder.com/350x350"
                            alt="Coding Illustration"
                            className="coding-image"
                        />
                    </div>
                    {/* Text and Buttons Section */}
                    <div className="text-section">
                        <h2 className="headline">
                            "Learn, Engage, and Achieve – The Joyful Path to Mastering a New Language!"
                        </h2>
                        <div className="buttons">
                            <button
                                className="get-started-btn"
                                onClick={() => navigate('/signup')}
                            >
                                GET STARTED
                            </button>
                            <button
                                className="login-btn"
                                onClick={() => navigate('/login')}
                            >
                                I ALREADY HAVE AN ACCOUNT
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Navigation Buttons */}
            <footer className="footer">
                <button className="redirect-btn" onClick={() => navigate('/introduction')}>
                    Introduction of Computer
                </button>
                <button className="redirect-btn" onClick={() => navigate('/frontend')}>
                    Front-end Development
                </button>
                <button className="redirect-btn" onClick={() => navigate('/backend')}>
                    Back-end Development
                </button>
            </footer>

            {/* Page 2: Features Section */}
            <div className="additional-sections">
                <section className="features-section">
                    <h2 className="section-title">free. fun. effective.</h2>
                    <div className="features-content">
                        <p>
                            Learning with LearnIT is engaging and research-based! Unlock new levels with gamified lessons.
                        </p>
                        <img 
                            src="https://via.placeholder.com/300x400" 
                            alt="Features Illustration" 
                            className="section-image"
                        />
                    </div>
                </section>

                {/* Page 3: Science Section */}
                <section className="science-section">
                    <h2 className="section-title">backed by science.</h2>
                    <div className="science-content">
                        <img 
                            src="https://via.placeholder.com/300x300" 
                            alt="Science Illustration" 
                            className="section-image"
                        />
                        <p>
                            We use research-backed teaching methods to create courses that teach reading, writing, and coding skills effectively!
                        </p>
                    </div>
                </section>

                {/* Page 4: Motivation Section */}
                <section className="motivation-section">
                    <h2 className="section-title">stay motivated.</h2>
                    <div className="motivation-content">
                        <p>
                            Build habits with game-like features, fun challenges, and rewards that keep you motivated!
                        </p>
                        <img 
                            src="https://via.placeholder.com/300x300" 
                            alt="Motivation Illustration" 
                            className="section-image"
                        />
                    </div>
                </section>

                {/* Last Page: About Section */}
                <footer className="footer-columns">
                    <div className="column">
                        <h3>About Us</h3>
                        <ul>
                            <li>Courses</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div className="column">
                        <h3>Help</h3>
                        <ul>
                            <li>Support</li>
                        </ul>
                    </div>
                    <div className="column">
                        <h3>Social</h3>
                        <ul>
                            <li>Mail</li>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default OpeningPage;
