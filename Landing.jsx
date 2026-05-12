import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Zap,
  Bell,
  FileWarning,
  Receipt,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Logo from "../components/common/Logo";

export default function Landing() {
  const [activeSection, setActiveSection] = useState("home");

  function scrollToSection(id) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="landing-page new-landing">
      <div className="landing-shapes">
        <span className="shape shape-one"></span>
        <span className="shape shape-two"></span>
        <span className="shape shape-three"></span>
        <span className="shape shape-four"></span>
      </div>

      <header className="new-landing-nav">
        <Logo size="md" subtitle="Luzon Power Monitoring" />

        <nav>
          <button
            className={activeSection === "home" ? "nav-active" : ""}
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>

          <button
            className={activeSection === "about" ? "nav-active" : ""}
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            className={activeSection === "service" ? "nav-active" : ""}
            onClick={() => scrollToSection("service")}
          >
            Service
          </button>

          <button
            className={activeSection === "contact" ? "nav-active" : ""}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </nav>

        <div className="new-landing-actions">
          <Link to="/login">Log In</Link>
          <Link to="/register">Register</Link>
        </div>
      </header>

      <section id="home" className="new-hero-section">
        <div className="new-hero-text">
          <span>New Power Monitoring System</span>

          <h1>
            Area-Based Power Interruption Updates for Luzon
          </h1>

          <p>
            ElectroPulse helps consumers receive interruption alerts,
            restoration updates, bill reminders, receipts, and damage report
            tracking through one centralized system.
          </p>

          <Link to="/register" className="hero-subscribe-btn">
            <ArrowRight size={22} />
            Get Started
          </Link>
        </div>

        <div className="hero-glass-panel">
          <h3>What users can receive</h3>
          <p>
            Get notified when your barangay is affected by scheduled or
            emergency power interruptions.
          </p>

          <div className="mini-feature-grid">
            <div>
              <Bell size={22} />
              <span>Alerts</span>
            </div>

            <div>
              <FileWarning size={22} />
              <span>Reports</span>
            </div>

            <div>
              <Receipt size={22} />
              <span>Bills</span>
            </div>

            <div>
              <Zap size={22} />
              <span>Updates</span>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="landing-info-section">
        <div className="section-title">
          <span>About ElectroPulse</span>
          <h2>Built for organized power communication</h2>
        </div>

        <p>
          ElectroPulse is a web-based power supply monitoring and management
          system designed to help electric companies communicate power
          interruptions, affected areas, restoration progress, and billing
          updates clearly to consumers.
        </p>
      </section>

      <section id="service" className="landing-service-section">
        <div className="section-title">
          <span>Services</span>
          <h2>Features</h2>
        </div>

        <div className="landing-service-grid">
          <div>
            <Zap />
            <h3>Interruption Monitoring</h3>
            <p>Admin posts scheduled or ongoing interruptions by area.</p>
          </div>

          <div>
            <Bell />
            <h3>Area Notifications</h3>
            <p>Users receive alerts only for their selected barangay.</p>
          </div>

          <div>
            <FileWarning />
            <h3>Damage Reports</h3>
            <p>Consumers submit reports with images and status tracking.</p>
          </div>

          <div>
            <Receipt />
            <h3>Bills & Receipts</h3>
            <p>Users can view bills and generate payment receipts.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-contact-section">
        <div className="section-title">
          <span>Contact</span>
          <h2>Need assistance?</h2>
        </div>

        <div className="contact-grid">
          <div>
            <Mail />
            <p>support@electropulse.local</p>
          </div>

          <div>
            <MapPin />
            <p>Luzon, Philippines</p>
          </div>
        </div>
      </section>
    </div>
  );
}