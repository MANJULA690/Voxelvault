import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ModelCard from "../components/ModelCard";
import toast from "react-hot-toast";
import "./Gallery.css";

const CATEGORIES = ["all", "architecture", "character", "vehicle", "nature", "product", "abstract", "other"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Liked" },
  { value: "views", label: "Most Viewed" },
];

export default function Gallery() {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (user) {
      api.get("/users/bookmarks/me").then((res) =>
        setBookmarks(res.data.map((m) => m._id))
      );
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ category, sort });
    if (search) params.set("search", search);
    api.get(`/models?${params}`)
      .then((res) => setModels(res.data))
      .catch(() => toast.error("Failed to load models"))
      .finally(() => setLoading(false));
  }, [category, sort, search]);

  const handleBookmark = async (modelId) => {
    if (!user) return toast.error("Sign in to bookmark models");
    try {
      const res = await api.put(`/users/bookmark/${modelId}`);
      setBookmarks(res.data.bookmarks);
      const isNowBookmarked = res.data.bookmarks.includes(modelId);
      toast.success(isNowBookmarked ? "Bookmarked!" : "Bookmark removed");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="gallery page-enter">
      <div className="gallery-header">
        <div className="gallery-header-top">
          <div>
            <h1 className="gallery-title">Model Gallery</h1>
            <p className="gallery-sub">{models.length} models found</p>
          </div>

          <div className="gallery-controls">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text" placeholder="Search models or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-wrap">
              <SlidersHorizontal size={15} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`cat-pill ${category === cat ? "active" : ""}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : models.length === 0 ? (
        <div className="empty-state">
          <p>No models found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="models-grid gallery-grid">
          {models.map((m) => (
            <ModelCard
              key={m._id}
              model={m}
              onBookmark={handleBookmark}
              isBookmarked={bookmarks.includes(m._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
