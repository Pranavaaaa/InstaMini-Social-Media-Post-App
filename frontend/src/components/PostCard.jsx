import { useMemo, useRef } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostCard({ post, onChange }) {
  const { token, user } = useAuth();
  const username = user ? `${user.fullName.firstName} ${user.fullName.lastName}` : "";
  const liked = post.likes?.includes(username);
  const commentInputRef = useRef(null);

  const handle = useMemo(() => {
    if (!post.username) return "";
    return `@${post.username.toLowerCase().replace(/\s+/g, "")}`;
  }, [post.username]);

  const createdAt = useMemo(() => {
    try {
      return new Date(post.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [post.createdAt]);

  const toggleLike = async () => {
    try {
      const data = await apiRequest(`/posts/${post._id}/like`, { method: "POST", token });
      onChange?.({ ...post, likes: data.likedBy });
    } catch (err) {}
  };

  const addComment = async (e) => {
    e.preventDefault();
    const value = commentInputRef.current?.value?.trim();
    if (!value) return;
    commentInputRef.current.value = "";
    try {
      const data = await apiRequest(`/posts/${post._id}/comment`, { method: "POST", token, body: { text: value } });
      onChange?.({ ...post, comments: data.comments });
    } catch (err) {}
  };

  return (
    <article className="post-card">
      <header className="post-card__header">
        <div className="post-card__avatar">{post.username?.[0]}</div>
        <div className="post-card__meta">
          <div className="post-card__topline">
            <span className="post-card__username">{post.username}</span>
            <span className="post-card__handle">{handle}</span>
            <span className="post-card__dot">•</span>
            <time className="post-card__timestamp">{createdAt}</time>
          </div>
        </div>
      </header>

      {post.text && <p className="post-card__text">{post.text}</p>}

      {post.imageUrl && (
        <div className="post-card__media">
          <img src={post.imageUrl} alt="post attachment" loading="lazy" />
        </div>
      )}

      <footer className="post-card__footer">
        <button className={liked ? "like liked" : "like"} onClick={toggleLike} type="button">
          <span>❤</span>
          <small>{post.likes?.length || 0}</small>
        </button>
        <div className="post-card__stat">
          <span>💬</span>
          <small>{post.comments?.length || 0}</small>
        </div>
        <div className="post-card__stat">
          <span>↗</span>
        </div>
      </footer>

      {user && (
        <form className="post-card__comment" onSubmit={addComment}>
          <input ref={commentInputRef} placeholder="Add a thoughtful reply" />
        </form>
      )}
    </article>
  );
}


