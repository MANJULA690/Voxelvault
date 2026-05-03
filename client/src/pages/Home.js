import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Zap, Users, Star } from "lucide-react";
import api from "../utils/api";
import ModelCard from "../components/ModelCard";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/models?sort=popular").then((res) => setFeatured(res.data.slice(0, 6)));
  }, []);

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={12} />
            <span>3D Creator Community</span>
          </div>
          <h1 className="hero-title glow">
            Discover & Share<br />
            <span className="hero-accent">3D Masterpieces</span>
          </h1>
          <p className="hero-sub">
            A community platform for 3D artists, designers, and creators to showcase their work,
            discover inspiration, and connect with builders worldwide.
          </p>
          <div className="hero-cta">
            <Link to="/gallery" className="btn-primary">
              <Box size={18} /> Explore Gallery
            </Link>
            <Link to="/signup" className="btn-ghost">Join the Community →</Link>
          </div>

          <div className="hero-stats">
            {[
              { icon: <Box size={18} />, val: "500+", label: "Models" },
              { icon: <Users size={18} />, val: "200+", label: "Creators" },
              { icon: <Star size={18} />, val: "1K+", label: "Likes" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                {s.icon}
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Trending Models</h2>
            <Link to="/gallery" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              View All →
            </Link>
          </div>
          <div className="models-grid">
            {featured.map((m) => (
              <ModelCard key={m._id} model={m} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to showcase your 3D work?</h2>
          <p>Join VoxelVault and share your creations with a growing community of makers.</p>
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
}
