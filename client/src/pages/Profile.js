import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ModelCard from "../components/ModelCard";
import toast from "react-hot-toast";
import { User, Edit2, Check, X } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatar: "" });

  const isOwn = user?._id === id;

  useEffect(() => {
    api.get(`/users/${id}/profile`)
      .then((res) => {
        setProfile(res.data.user);
        setUploads(res.data.uploads);
        setEditForm({ name: res.data.user.name, bio: res.data.user.bio || "", avatar: res.data.user.avatar || "" });
      })
      .catch(() => toast.error("Profile not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await api.put("/users/profile", editForm);
      setProfile(res.data);
      setUser(res.data);
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Update failed"); }
  };

  if (loading) return <div className="spinner" />;
  if (!profile) return <div className="empty-state"><p>User not found.</p></div>;

  return (
    <div className="profile-page page-enter">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header card">
          <div className="profile-avatar-wrap">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                <User size={40} />
              </div>
            )}
          </div>

          <div className="profile-meta">
            {editing ? (
              <div className="edit-form">
                <input
                  value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Your name" className="edit-input"
                />
                <input
                  value={editForm.avatar} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="Avatar image URL" className="edit-input"
                />
                <textarea
                  value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..." rows={3} className="edit-input"
                />
                <div className="edit-actions">
                  <button className="btn-primary" style={{ padding: "8px 20px" }} onClick={handleSave}>
                    <Check size={15} /> Save
                  </button>
                  <button className="btn-ghost" style={{ padding: "8px 20px" }} onClick={() => setEditing(false)}>
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-name-row">
                  <h1 className="profile-name">{profile.name}</h1>
                  {isOwn && (
                    <button className="btn-ghost edit-btn" onClick={() => setEditing(true)}>
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
                <p className="profile-email">{profile.email}</p>
                {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                <div className="profile-stats">
                  <div className="profile-stat">
                    <strong>{uploads.length}</strong><span>Models</span>
                  </div>
                  <div className="profile-stat">
                    <strong>{uploads.reduce((a, m) => a + (m.likes?.length || 0), 0)}</strong>
                    <span>Total Likes</span>
                  </div>
                  <div className="profile-stat">
                    <strong>{uploads.reduce((a, m) => a + (m.views || 0), 0)}</strong>
                    <span>Total Views</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Uploads */}
        <div className="profile-section">
          <h2 className="section-title" style={{ marginBottom: "24px" }}>
            {isOwn ? "My Models" : `${profile.name}'s Models`}
          </h2>
          {uploads.length === 0 ? (
            <div className="empty-state"><p>No models uploaded yet.</p></div>
          ) : (
            <div className="models-grid">
              {uploads.map((m) => <ModelCard key={m._id} model={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
