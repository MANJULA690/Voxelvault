import { useState, useEffect } from "react";
import api from "../utils/api";
import ModelCard from "../components/ModelCard";
import toast from "react-hot-toast";
import { Bookmark } from "lucide-react";
import "./Gallery.css";

export default function Bookmarks() {
  const [models, setModels] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/bookmarks/me")
      .then((res) => {
        setModels(res.data);
        setBookmarkIds(res.data.map((m) => m._id));
      })
      .catch(() => toast.error("Failed to load bookmarks"))
      .finally(() => setLoading(false));
  }, []);

  const handleBookmark = async (modelId) => {
    try {
      await api.put(`/users/bookmark/${modelId}`);
      setModels((prev) => prev.filter((m) => m._id !== modelId));
      setBookmarkIds((prev) => prev.filter((id) => id !== modelId));
      toast.success("Bookmark removed");
    } catch { toast.error("Something went wrong"); }
  };

  return (
    <div className="gallery page-enter">
      <div className="gallery-header">
        <div className="gallery-header-top">
          <div>
            <h1 className="gallery-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Bookmark size={24} /> Saved Models
            </h1>
            <p className="gallery-sub">{models.length} bookmarked models</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : models.length === 0 ? (
        <div className="empty-state">
          <p>No bookmarks yet. Browse the gallery and save models you love!</p>
        </div>
      ) : (
        <div className="models-grid">
          {models.map((m) => (
            <ModelCard
              key={m._id} model={m}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkIds.includes(m._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
