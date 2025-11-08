import { useState, useEffect } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function CreatePost({ onCreated }) {
  const { token, user } = useAuth();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreview("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedText = text.trim();
    if (!trimmedText && !imageFile) {
      setError("Write something or pick an image");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (trimmedText) formData.append("text", trimmedText);
      if (imageFile) formData.append("image", imageFile);
      const post = await apiRequest("/posts", { method: "POST", token, body: formData });
      setText("");
      setImageFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      onCreated?.(post);
    } catch (err) {
      setError(err.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-post" onSubmit={submit}>
      <div className="create-post__row">
        <div className="create-post__avatar">{user?.fullName?.firstName?.[0] || "U"}</div>
        <textarea
          placeholder="Share something inspiring with the crew..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {preview && (
        <div className="preview">
          <img src={preview} alt="preview" />
        </div>
      )}

      {error && <div className="error small">{error}</div>}

      <div className="create-post__footer">
        <div className="create-post__tools">
          <label className="upload-chip">
            <input type="file" accept="image/*" onChange={onFileChange} hidden />
            <span>📷 {imageFile ? imageFile.name : "Add media"}</span>
          </label>
        </div>
        <button disabled={loading}>{loading ? "Posting..." : "Post"}</button>
      </div>
    </form>
  );
}


