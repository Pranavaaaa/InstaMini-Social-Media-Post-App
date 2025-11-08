import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import Login from "./Login.jsx";

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async (reset = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const nextPage = reset ? 1 : page;
      const data = await apiRequest(`/posts/feed?page=${nextPage}&limit=10`);
      setPosts((prev) => (reset ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
      setPage(nextPage + 1);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPage(1);
      load(true);
    } else {
      setPosts([]);
      setFilter("all");
      setPage(1);
      setTotal(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredPosts = useMemo(() => {
    if (filter === "mine" && user) {
      return posts.filter((post) => String(post.userId) === String(user._id));
    }
    return posts;
  }, [posts, filter, user]);

  const canLoadMore = filter === "all" && posts.length < total;

  if (!user) {
    return (
      <div className="auth-gate dark">
        <Login variant="dark" embedded />
      </div>
    );
  }

  return (
    <div className="timeline-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">TaskPlanet</div>
        <nav className="sidebar-nav">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            <span className="icon">🏠</span>
            <span>All posts</span>
          </button>
          <button className={filter === "mine" ? "active" : ""} onClick={() => setFilter("mine")}>
            <span className="icon">🪪</span>
            <span>My posts</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="current-user">
            <div className="avatar">{user.fullName.firstName?.[0]}</div>
            <div>
              <strong>{user.fullName.firstName} {user.fullName.lastName}</strong>
              <div className="handle">@{user.fullName.firstName.toLowerCase()}{user.fullName.lastName?.[0]?.toLowerCase() || ""}</div>
            </div>
          </div>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="timeline">
        <header className="timeline-header">
          <button className={filter === "all" ? "tab active" : "tab"} onClick={() => setFilter("all")}>For you</button>
          <button className={filter === "mine" ? "tab active" : "tab"} onClick={() => setFilter("mine")}>My posts</button>
        </header>

        <div className="timeline-content">
          <section className="timeline-hero">
            <div>
              <h2>Share your TaskPlanet journey</h2>
              <p>Celebrate wins, drop inspiration, and discover what the community is building.</p>
            </div>
            <div className="hero-pill">✨ Consistency unlocks rewards</div>
          </section>

          <section className="composer-card">
            <CreatePost onCreated={() => load(true)} />
          </section>

          <section className="post-stream">
          {filteredPosts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              onChange={(np) => setPosts((arr) => arr.map((x) => (x._id === np._id ? np : x)))}
            />
          ))}

          {filteredPosts.length === 0 && !loading && (
            <div className="empty">{filter === "mine" ? "You haven't posted yet." : "No posts yet."}</div>
          )}

          {canLoadMore && (
            <div className="load-more">
              <button disabled={loading} onClick={() => load(false)}>{loading ? "Loading..." : "Load more"}</button>
            </div>
          )}

          <div className="feed-footer">You’re fully up to speed. New content will appear soon✌️</div>
        </section>
        </div>
      </main>

      <aside className="right-panel">
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <h3 style={{margin: 0}}>Community</h3>
          <p style={{margin: 0, color: 'var(--muted)', fontSize: '0.95rem'}}>Tips & highlights from the community.</p>
          <div className="login-hint" style={{marginTop:12}}>
            <div>Discover featured posts, creators to follow, and weekly challenges.</div>
            <div className="actions" style={{display:'flex', gap:8, marginTop:8}}>
              <a className="primary" href="#">Explore</a>
              <a href="#">Learn</a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}


