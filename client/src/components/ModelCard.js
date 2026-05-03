import { Link } from "react-router-dom";
import { Heart, Eye, Bookmark } from "lucide-react";
import "./ModelCard.css";

export default function ModelCard({ model, onBookmark, isBookmarked }) {
  return (
    <div className="model-card card">
      <Link to={`/model/${model._id}`} className="model-card-img-wrap">
        <img
          src={model.thumbnail}
          alt={model.title}
          className="model-card-img"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x260/111118/7c3aed?text=3D+Model`;
          }}
        />
        <div className="model-card-overlay">
          <span className="model-card-category tag">{model.category}</span>
        </div>
      </Link>

      <div className="model-card-body">
        <div className="model-card-top">
          <Link to={`/model/${model._id}`} className="model-card-title">
            {model.title}
          </Link>
          {onBookmark && (
            <button
              onClick={() => onBookmark(model._id)}
              className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
            >
              <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        <p className="model-card-author">
          by <Link to={`/profile/${model.author?._id}`}>{model.author?.name}</Link>
        </p>

        <div className="model-card-tags">
          {model.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="model-card-stats">
          <span><Heart size={13} /> {model.likes?.length || 0}</span>
          <span><Eye size={13} /> {model.views || 0}</span>
        </div>
      </div>
    </div>
  );
}
