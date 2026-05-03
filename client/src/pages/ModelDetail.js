import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Heart, Eye, Bookmark, Trash2, ExternalLink, ArrowLeft, User } from "lucide-react";
import "./ModelDetail.css";

export default function ModelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    api.get(`/models/${id}`)
      .then((res) => {
        setModel(res.data);
        setLikeCount(res.data.likes?.length || 0);
        if (user) setLiked(res.data.likes?.includes(user._id));
      })
      .catch(() => toast.error("Model not found"))
      .finally(() => setLoading(false));

    if (user) {
      api.get("/users/bookmarks/me").then((res) => {
        setBookmarked(res.data.some((m) => m._id === id));
      });
    }
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Sign in to like");
    try {
      const res = await api.put(`/models/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch { toast.error("Failed to like"); }
  };

  const handleBookmark = async () => {
    if (!user) return toast.error("Sign in to bookmark");
    try {
      const res = await api.put(`/users/bookmark/${id}`);
      const isNow = res.data.bookmarks.includes(id);
      setBookmarked(isNow);
      toast.success(isNow ? "Bookmarked!" : "Removed bookmark");
    } catch { toast.error("Failed to bookmark"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this model?")) return;
    try {
      await api.delete(`/models/${id}`);
      toast.success("Model deleted");
      navigate("/gallery");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="spinner" />;
  if (!model) return <div className="empty-state"><p>Model not found.</p></div>;

  const isOwner = user && model.author?._id === user._id;

  return (
    <div className="model-detail page-enter">
      <div className="detail-container">
        <Link to="/gallery" className="back-btn">
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div className="detail-layout">
          {/* Left: image / embed */}
          <div className="detail-media">
            {model.embedUrl ? (
              <iframe
                src={model.embedUrl.replace("models/", "models/embed/")}
                title={model.title}
                className="detail-iframe"
                allowFullScreen
              />
            ) : (
              <img src={model.thumbnail} alt={model.title} className="detail-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x500/111118/7c3aed?text=3D+Model"; }} />
            )}
          </div>

          {/* Right: info */}
          <div className="detail-info">
            <div className="detail-top">
              <span className="tag">{model.category}</span>
              <div className="detail-actions">
                <button onClick={handleLike} className={`action-btn ${liked ? "liked" : ""}`}>
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  <span>{likeCount}</span>
                </button>
                <button onClick={handleBookmark} className={`action-btn ${bookmarked ? "bookmarked" : ""}`}>
                  <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                </button>
                {model.embedUrl && (
                  <a href={model.embedUrl} target="_blank" rel="noreferrer" className="action-btn">
                    <ExternalLink size={18} />
                  </a>
                )}
                {isOwner && (
                  <button onClick={handleDelete} className="action-btn danger">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <h1 className="detail-title">{model.title}</h1>

            <Link to={`/profile/${model.author?._id}`} className="detail-author">
              <User size={15} />
              {model.author?.name}
            </Link>

            <div className="detail-stats">
              <span><Eye size={14} /> {model.views} views</span>
              <span><Heart size={14} /> {likeCount} likes</span>
            </div>

            {model.description && (
              <p className="detail-desc">{model.description}</p>
            )}

            {model.tags?.length > 0 && (
              <div className="detail-tags">
                <p className="detail-section-label">Tags</p>
                <div className="tags-row">
                  {model.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="detail-date">
              Uploaded {new Date(model.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
