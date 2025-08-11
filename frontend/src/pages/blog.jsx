import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./Blog.module.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

// Helper to strip HTML tags and get plain text
function getTextFromHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const Blog = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState(null); // base64 preview / upload
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null); // view modal
  const [editingBlog, setEditingBlog] = useState(null); // blog being edited
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
  const fileInputRef = useRef(null);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/blogs`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setBlogs(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API_BASE]);

  const handleAddBlog = () => { setShowEditor(true); setEditingBlog(null); };

  const resetEditorState = () => {
    setBlogTitle("");
    setEditorContent("");
    setImage(null);
    setEditingBlog(null);
  };

  const handleCloseEditor = () => { setShowEditor(false); resetEditorState(); };

  const handleSave = async () => {
    if (!blogTitle.trim() || !editorContent.trim()) return;
    setSaving(true); setError(null);
    try {
      const payload = { title: blogTitle.trim(), content: editorContent, image };
      let res;
      if (editingBlog) {
        res = await fetch(`${API_BASE}/api/blogs/${editingBlog._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`${API_BASE}/api/blogs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const data = await res.json();
      const savedBlog = data.blog || data; // create returns {blog}, update returns {blog}
      if (editingBlog) {
        setBlogs(prev => prev.map(b => b._id === savedBlog._id ? savedBlog : b));
      } else {
        setBlogs(prev => [savedBlog, ...prev]);
      }
      handleCloseEditor();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTileClick = (blog) => { setActiveBlog(blog); document.body.style.overflow = "hidden"; };
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setEditorContent(blog.content);
    setImage(blog.image || null);
    setShowEditor(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this blog?')) return;
    setDeletingId(blogId); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${blogId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setBlogs(prev => prev.filter(b => b._id !== blogId));
      if (activeBlog && activeBlog._id === blogId) handleCloseBlogPopup();
    } catch (e) { setError(e.message); }
    finally { setDeletingId(null); }
  };

  const emptySkeletons = !loading && blogs.length === 0;

  const handleCloseBlogPopup = () => {
    setActiveBlog(null);
    document.body.style.overflow = "";
  };

  return (
    <div className={styles.blogPage}>
      <h1 className={styles.title}>Stories by the Solos</h1>
      <div className={styles.tilesContainer}>
        {loading && <div style={{color:'#034078', fontWeight:600}}>Loading blogs...</div>}
        {error && <div style={{color:'#b91c1c', fontWeight:500, background:'#ffe4e6', padding:'8px 14px', borderRadius:8, alignSelf:'stretch'}}>{error}</div>}
        {emptySkeletons && (
          <div style={{opacity:.7, fontStyle:'italic', color:'#011D4D'}}>No blog posts yet. Be the first to write one.</div>
        )}
        {blogs.map((blog) => {
          const text = getTextFromHtml(blog.content);
          return (
            <div className={styles.blogTile} key={blog._id}>
              <div onClick={() => handleTileClick(blog)} style={{flex:1, width:'100%'}}>
                <h2 className={styles.blogTileTitle}>{blog.title}</h2>
                <div className={styles.blogTileContentPreview}>
                  {text.slice(0,180)}{text.length>180 && '...'}
                </div>
                {blog.image && (
                  <img src={blog.image} alt="blog" className={styles.blogTileImagePreview} />
                )}
              </div>
              <div className={styles.tileActions}>
                <button onClick={() => handleEdit(blog)} className={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(blog._id)} className={styles.deleteBtn} disabled={deletingId===blog._id}>{deletingId===blog._id? 'Deleting...':'Delete'}</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className={styles.addBlogBtn} onClick={handleAddBlog}>
        {editingBlog? 'Add New' : 'Add Blog'}
      </button>
      {showEditor && (
        <div className={styles.editorOverlay}>
          <div className={styles.editorModal}>
    <label className={styles.label} style={{ marginBottom: 12 }}>
              <span className={styles.editorLabel}>
                Blog Title <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <input
                className={styles.input}
                type="text"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Enter your blog title"
                required
                style={{
      background: "#E4DFDA",
      border: "1.5px solid #1282A2",
                  borderRadius: 8,
                  marginTop: 4,
                  marginBottom: 8,
                  padding: "8px 12px",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }}
              />
            </label>
            <label className={styles.label}>
              <span className={styles.editorLabel}>
                Blog Content <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <div className={styles.richEditor}>
        <ReactQuill
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={quillModules}
                  theme="snow"
                  style={{
          background: "#E4DFDA",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
              </div>
            </label>
            <label className={styles.label}>
              <span className={styles.editorLabel}>Add Image (optional)</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className={styles.input}
                style={{ padding: 0, border: "none", background: "none" }}
              />
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className={styles.previewImage}
                  style={{
                    marginTop: 12,
                    maxWidth: "100%",
                    borderRadius: 10,
                    boxShadow: "0 2px 12px rgba(80,80,180,0.09)",
                  }}
                />
              )}
            </label>
            <div className={styles.editorActions}>
              <button onClick={handleCloseEditor} className={styles.cancelBtn} disabled={saving}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving? (editingBlog? 'Updating...':'Saving...') : (editingBlog? 'Update':'Save')}</button>
            </div>
          </div>
        </div>
      )}
      {activeBlog && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupModal}>
            <button className={styles.popupClose} onClick={handleCloseBlogPopup}>
              &times;
            </button>
            <h2 className={styles.popupTitle}>{activeBlog.title}</h2>
            <div
              className={styles.popupContent}
              dangerouslySetInnerHTML={{ __html: activeBlog.content }}
            />
            {activeBlog.image && (
              <img
                src={activeBlog.image}
                alt="blog"
                className={styles.popupImage}
              />
            )}
            <div style={{display:'flex', gap:12, marginTop:24}}>
              <button className={styles.editBtn} onClick={() => { handleEdit(activeBlog); handleCloseBlogPopup(); }}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(activeBlog._id)} disabled={deletingId===activeBlog._id}>{deletingId===activeBlog._id? 'Deleting...':'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;