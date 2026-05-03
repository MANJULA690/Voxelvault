import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Box, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);
      toast.success("Account created! Welcome to VoxelVault 🎉");
      navigate("/gallery");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-logo">
          <Box size={28} />
          <span>VoxelVault</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join the 3D creator community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Full Name</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text" name="name" placeholder="Your name"
                value={form.name} onChange={handleChange} required
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? "text" : "password"} name="password"
                placeholder="Min. 6 characters" value={form.password}
                onChange={handleChange} required
                style={{ paddingLeft: "42px", paddingRight: "42px" }}
              />
              <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
