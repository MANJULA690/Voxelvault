import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Upload, Tag, Image, Link as LinkIcon, AlignLeft, Layers } from "lucide-react";
import "./UploadModel.css";

const CATEGORIES = ["architecture", "character", "vehicle", "nature", "product", "abstract", "other"];

export default function UploadModel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", thumbnail: "",
    embedUrl: "", tags: [], category: "other",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
        setForm({ ...form, tags: [...form.tags, tag] });
        setTagInput("");
      }
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/models", form);
      toast.success("Model uploaded! 🎉");
      navigate(`/model/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page page-enter">
      <div className="upload-container">
        <div className="upload-header">
          <Upload size={24} />
          <div>
            <h1>Upload 3D Model</h1>
            <p>Share your creation with the community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="field-group">
            <label><Layers size={14} /> Title *</label>
            <input
              name="title" placeholder="Give your model a great name"
              value={form.title} onChange={handleChange} required
            />
          </div>

          <div className="field-group">
            <label><AlignLeft size={14} /> Description</label>
            <textarea
              name="description" placeholder="Describe your 3D model, tools used, inspiration..."
              value={form.description} onChange={handleChange} rows={4}
            />
          </div>

          <div className="form-row">
            <div className="field-group">
              <label><Image size={14} /> Thumbnail URL *</label>
              <input
                name="thumbnail" placeholder="https://i.imgur.com/example.jpg"
                value={form.thumbnail} onChange={handleChange} required
              />
              {form.thumbnail && (
                <div className="thumb-preview">
                  <img src={form.thumbnail} alt="preview"
                    onError={(e) => e.target.style.display = "none"} />
                </div>
              )}
            </div>

            <div className="field-group">
              <label><LinkIcon size={14} /> Embed / Sketchfab URL</label>
              <input
                name="embedUrl" placeholder="https://sketchfab.com/models/..."
                value={form.embedUrl} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label><Layers size={14} /> Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label><Tag size={14} /> Tags (press Enter to add)</label>
              <input
                placeholder="e.g. sci-fi, blender, lowpoly"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              <div className="tags-row">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag tag-removable">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary upload-btn" disabled={loading}>
            <Upload size={17} />
            {loading ? "Uploading..." : "Publish Model"}
          </button>
        </form>
      </div>
    </div>
  );
}
