import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import sportsImg from '../assets/sports.png';
import foodImg from '../assets/food.png';
import culturalImg from '../assets/cultural.png';
import logoImg from '../assets/logo.png';
import sports2Img from '../assets/sports2.png';
import food2Img from '../assets/food2.png';
import cultural2Img from '../assets/cultural2.png';

function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [progress, setProgress] = useState(0);

  // Create 100 blocks for the reveal grid
  const blocks = Array.from({ length: 100 });

  // Default images in case backend is empty
  const defaultGallery = [sportsImg, foodImg, culturalImg, sports2Img, food2Img, cultural2Img];

  // Backend Connectivity Check & Content Fetch
  useEffect(() => {
    if (!loading) {
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

      // Fetch Gallery
      fetch(`${apiUrl}/api/gallery`)
        .then(res => res.json())
        .then(data => setGalleryItems(data))
        .catch(err => console.warn('Error fetching gallery'));

      // Fetch Settings
      fetch(`${apiUrl}/api/settings`)
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.warn('Error fetching settings'));

      // Fetch Announcements
      fetch(`${apiUrl}/api/announcements`)
        .then(res => res.json())
        .then(data => setAnnouncements(data))
        .catch(err => console.warn('Error fetching announcements'));
    }
  }, [loading]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    email: '',
    dept: '',
    year: 'I',
    event: 'Sports'
  });
  const [regStatus, setRegStatus] = useState('idle'); // idle, submitting, success

  const handleRegister = (eventName = 'Sports') => {
    const types = {
      'Sports': 'sports',
      'Food Fest': 'food',
      'Cultural': 'cultural',
      'General': 'sports'
    };
    const type = types[eventName] || 'sports';
    navigate(`/auth?type=${type}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    setRegStatus('submitting');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setRegStatus('success');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      alert('Backend connection error! Please ensure the server is running on port 5000.');
      setRegStatus('idle');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setRegStatus('idle');
    setFormData({
      name: '',
      regNo: '',
      email: '',
      dept: '',
      year: 'I',
      event: 'Sports'
    });
  };

  // Preloader and Hero Reveal
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const step = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    const timer = setTimeout(() => {
      setLoading(false);
      // After preloader, start the grid block reveal
      setTimeout(() => {
        setShowGrid(false);
        // Finally reveal hero content
        setTimeout(() => setHeroRevealed(true), 1200);
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-observe');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, galleryItems]); // Added galleryItems to re-run when images load

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.onscroll = handleScroll;
    return () => (window.onscroll = null);
  }, []);

  return (
    <div className="app-container">
      <div
        className="mouse-follower"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
        }}
      ></div>
      {/* Preloader */}
      <div className={`preloader ${!loading ? 'fade-out' : ''}`}>
        <div className="preloader-content">
          <div className="loader-text">DMIEC</div>
          <div className="loader-progress">{Math.floor(progress)}%</div>
          <div className="loader-bar-wrap">
            <div className="loader-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid Reveal Overlay */}
      <div className={`reveal-grid ${!showGrid ? 'active' : ''}`}>
        {blocks.map((_, i) => (
          <div
            key={i}
            className="reveal-block"
            style={{
              transitionDelay: `${(i % 10 + Math.floor(i / 10)) * 0.05}s`
            }}
          ></div>
        ))}
      </div>

      <div className="bg-mesh"></div>

      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <img src={logoImg} alt="DMI Logo" className="logo-img" />
          <span>{settings.college_name ? 'DMIEC' : 'DMIEC'}</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#events">Events</a>
          <a href="#schedule">Schedule</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          <Link to="/admin-login" style={{ color: 'var(--accent-2)' }}>Admin</Link>
        </div>
        <button className="nav-btn" onClick={() => handleRegister('General')}>Register</button>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-decor decor-1"></div>
          <div className="hero-decor decor-2"></div>
          <div className={`hero-title-reveal ${heroRevealed ? 'active' : ''}`}>
            <span className="college-name">{settings.college_name || 'DMI ENGINEERING COLLEGE'}</span>
            <h1>{settings.event_title ? settings.event_title.split('&')[0] : 'COLLEGE DAY'}</h1>
            <h2 className="sub-title">{settings.event_title?.includes('&') ? '& ' + settings.event_title.split('&')[1] : '& SPORTS FEST 2026'}</h2>
          </div>

          {announcements.length > 0 && (
            <div className="news-ticker scroll-observe" style={{ width: '100%', maxWidth: '800px', margin: '20px auto', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '30px', border: '1px solid var(--accent-1)' }}>
              <div style={{ display: 'flex', gap: '20px', overflow: 'hidden' }}>
                <span style={{ color: 'var(--accent-1)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>LATEST NEWS:</span>
                <marquee scrollamount="5" style={{ color: '#fff' }}>
                  {announcements.map((a, idx) => (
                    <span key={idx} style={{ marginRight: '50px' }}>
                      <strong>{a.title}</strong>: {a.content}
                    </span>
                  ))}
                </marquee>
              </div>
            </div>
          )}

          <div className="hero-panels">
            {/* Panel 1 */}
            <div className={`hero-panel ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.2s' }}>
              <img src={sportsImg} alt="Sports" className="panel-img" />
              <div className="panel-overlay">
                <h3>SPORTS</h3>
                <p>March 27, 2026</p>
                <button className="panel-btn" onClick={() => handleRegister('Sports')}>Register</button>
              </div>
            </div>
            {/* Panel 2 */}
            <div className={`hero-panel ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <img src={foodImg} alt="Food" className="panel-img" />
              <div className="panel-overlay">
                <h3>FOOD FEST</h3>
                <p>March 06, 2026</p>
                <button className="panel-btn" onClick={() => handleRegister('Food Fest')}>Register</button>
              </div>
            </div>
            {/* Panel 3 */}
            <div className={`hero-panel ${heroRevealed ? 'reveal' : ''}`} style={{ transitionDelay: '0.6s' }}>
              <img src={culturalImg} alt="Cultural" className="panel-img" />
              <div className="panel-overlay">
                <h3>CULTURAL</h3>
                <p>March 28, 2026</p>
                <button className="panel-btn" onClick={() => handleRegister('Cultural')}>Register</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section scroll-observe">
        <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">A Legacy of Excellence</h2>
          <p className="section-subtitle">CELEBRATING STUDENT TALENT SINCE 2001</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '30px auto' }}>
            Get ready for the most awaited event of the year! DMI Engineering College presents a fusion of
            athletic prowess, culinary celebration, and cultural heritage. All activities and competitions
            are exclusively organized and performed by our own talented DMIEC students, showcasing the
            true spirit of our college.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="stats-grid">
          {[
            { value: settings.stats_mega_events || '3+', label: 'Mega Events' },
            { value: settings.stats_participants || '1000+', label: 'Student Participants' },
            { value: settings.stats_volunteers || '50+', label: 'Student Volunteers' },
            { value: 'Unlimited', label: 'Fun & Memories' }
          ].map((stat, i) => (
            <div key={i} className="stat-card scroll-observe" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="section">
        <h2 className="section-title scroll-observe">Signature Events</h2>
        <div className="events-grid">
          <div className="glass-panel event-card scroll-observe" style={{ transitionDelay: '0.1s' }}>
            <div className="preview-container">
              <img src={sportsImg} alt="Sports" className="event-img" />
            </div>
            <div className="event-icon">🏅</div>
            <h3 className="event-name">Sports League</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Competing for glory across track, field, and indoor arenas.</p>
            <div className="event-date">March 27th, 2026</div>
            <button className="nav-btn" style={{ marginTop: '20px', width: '100%', borderRadius: '8px' }} onClick={() => handleRegister('Sports')}>Register</button>
          </div>

          <div className="glass-panel event-card scroll-observe" style={{ transitionDelay: '0.2s' }}>
            <div className="preview-container">
              <img src={foodImg} alt="Food" className="event-img" />
            </div>
            <div className="event-icon">🍔</div>
            <h3 className="event-name">Grand Food Fest</h3>
            <p style={{ color: 'var(--text-secondary)' }}>A multi-cuisine extravaganza featuring flavors from around the world.</p>
            <div className="event-date">March 06th, 2026</div>
            <button className="nav-btn" style={{ marginTop: '20px', width: '100%', borderRadius: '8px' }} onClick={() => handleRegister('Food Fest')}>Register</button>
          </div>

          <div className="glass-panel event-card scroll-observe" style={{ transitionDelay: '0.3s' }}>
            <div className="preview-container">
              <img src={culturalImg} alt="Cultural" className="event-img" />
            </div>
            <div className="event-icon">🎸</div>
            <h3 className="event-name">Cultural Fest</h3>
            <p style={{ color: 'var(--text-secondary)' }}>A vibrant celebration of arts, music, dance and special guest performances.</p>
            <div className="event-date">March 28th, 2026</div>
            <button className="nav-btn" style={{ marginTop: '20px', width: '100%', borderRadius: '8px' }} onClick={() => handleRegister('Cultural')}>Register</button>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="section">
        <h2 className="section-title scroll-observe">Event Schedule</h2>
        <p className="scroll-observe" style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
          All events are exclusively organized and conducted by our DMIEC students.
        </p>
        <div className="glass-panel schedule-container scroll-observe">
          <div className="schedule-row header">
            <span>Date</span>
            <span>Category</span>
            <span>Event Name</span>
          </div>
          {[
            { date: 'Mar 06', cat: 'Food Fest', event: 'Grand Food Festival' },
            { date: 'Mar 27', cat: 'Sports', event: 'Sports & Athletics Day' },
            { date: 'Mar 28', cat: 'Cultural', event: 'Cultural Extravaganza' }
          ].map((item, i) => (
            <div className="schedule-row" key={i}>
              <span className="date-tag">{item.date}</span>
              <span className="cat-tag">{item.cat}</span>
              <span className="event-title">{item.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section">
        <h2 className="section-title scroll-observe">Moments</h2>
        <div className="gallery-grid">
          {galleryItems.length > 0 ? (
            galleryItems.map((item, i) => {
              // Fix for production paths (if using local assets via admin panel)
              let imgSrc = item.image_url;
              if (imgSrc.includes('sports.png')) imgSrc = sportsImg;
              else if (imgSrc.includes('food.png')) imgSrc = foodImg;
              else if (imgSrc.includes('cultural.png')) imgSrc = culturalImg;
              else if (imgSrc.includes('sports2.png')) imgSrc = sports2Img;
              else if (imgSrc.includes('food2.png')) imgSrc = food2Img;
              else if (imgSrc.includes('cultural2.png')) imgSrc = cultural2Img;

              return (
                <div className="gallery-item scroll-observe" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <img src={imgSrc} alt={item.category} loading="eager" />
                </div>
              );
            })
          ) : (
            defaultGallery.map((img, i) => (
              <div className="gallery-item scroll-observe" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <img src={img} alt={`Gallery ${i}`} loading="eager" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section">
        <h2 className="section-title scroll-observe">FAQs</h2>
        <div className="faq-container">
          {[
            { q: "Who can participate?", a: "This celebration is exclusive to the students of DMI Engineering College." },
            { q: "Where to register?", a: "Click the 'Register' button in the navigation bar to start your registration." },
            { q: "Contact for queries?", a: "You can reach out to our event coordinators at fest@dmiec.ac.in." }
          ].map((faq, i) => (
            <div className="glass-panel faq-item scroll-observe" key={i}>
              <h3 className="faq-q">{faq.q}</h3>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section scroll-observe">
        <div className="glass-panel contact-card">
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Connect With Us</h2>
          <div className="contact-details">
            <div className="contact-info">
              <p>Email: <strong>fest@dmiec.ac.in</strong></p>
              <p>Phone: <strong>+91 98765 43210</strong></p>
              <p>Location: <strong>Aralvaimozhi, Kanyakumari District</strong></p>
            </div>
            <div className="social-links">
              <a
                href="https://www.instagram.com/dmi_engg_college_official?igsh=MXBxdXlnb21seHRiZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn secondary-btn"
                style={{ padding: '8px 16px' }}
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/school/dmieckk/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn secondary-btn"
                style={{ padding: '8px 16px' }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer scroll-observe">
        <div className="footer-logo-wrap">
          <img src={logoImg} alt="DMI Logo" className="footer-logo" />
          <h3 className="footer-title">DMI Engineering College</h3>
        </div>
        <p className="footer-content">Developing Management Initiatives | Aralvaimozhi</p>
        <div style={{ marginTop: '30px', color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} DMIEC. All rights reserved. Built for Excellence.
        </div>
      </footer>
      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            {regStatus === 'success' ? (
              <div className="success-view" style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="success-icon" style={{
                  fontSize: '4rem',
                  color: 'var(--accent-2)',
                  marginBottom: '20px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  margin: '0 auto 20px'
                }}>✓</div>
                <h2 style={{ color: '#fff', marginBottom: '10px' }}>Registration Successful!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                  Thank you <strong>{formData.name}</strong>! Your registration for <strong>{formData.event}</strong> has been received.
                </p>
                <button className="nav-btn" onClick={resetForm}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '30px' }}>Register for {formData.event}</h2>
                <form onSubmit={submitRegistration} className="register-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Register Number</label>
                      <input
                        type="text"
                        name="regNo"
                        placeholder="Reg No"
                        value={formData.regNo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select name="dept" value={formData.dept} onChange={handleInputChange} required>
                        <option value="">Select Dept</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="IT">IT</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Year</label>
                      <select name="year" value={formData.year} onChange={handleInputChange}>
                        <option value="I">I Year</option>
                        <option value="II">II Year</option>
                        <option value="III">III Year</option>
                        <option value="IV">IV Year</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Selected Event</label>
                    <select name="event" value={formData.event} onChange={handleInputChange} required>
                      <option value="General">General Registration</option>
                      <option value="Sports">Sports League</option>
                      <option value="Food Fest">Food Festival</option>
                      <option value="Cultural">Cultural Fest</option>
                    </select>
                  </div>
                  <button type="submit" className="nav-btn" style={{ width: '100%', marginTop: '20px', padding: '15px' }} disabled={regStatus === 'submitting'}>
                    {regStatus === 'submitting' ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
