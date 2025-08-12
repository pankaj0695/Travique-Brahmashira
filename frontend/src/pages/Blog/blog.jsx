import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./blog.module.css";
import Footer from "../../components/Footer/Footer";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

function getTextFromHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const Blog = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
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

  const handleAddBlog = () => {
    resetEditorState();
    setShowEditor(true);
  };

  const resetEditorState = () => {
    setEditingBlog(null);
    setBlogTitle("");
    setEditorContent("");
    setImage(null);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    resetEditorState();
  };

  const handleSave = async () => {
    if (!blogTitle.trim() || !editorContent.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: blogTitle.trim(),
        content: editorContent,
        image,
      };
      let res;
      if (editingBlog) {
        res = await fetch(`${API_BASE}/api/blogs/${editingBlog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const data = await res.json();
      const savedBlog = data.blog || data;
      if (editingBlog) {
        setBlogs((prev) =>
          prev.map((b) => (b._id === savedBlog._id ? savedBlog : b))
        );
      } else {
        setBlogs((prev) => [savedBlog, ...prev]);
      }
      handleCloseEditor();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTileClick = (blog) => {
    setActiveBlog(blog);
  };

  const handleCloseBlogPopup = () => {
    setActiveBlog(null);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setEditorContent(blog.content);
    setImage(blog.image || null);
    setShowEditor(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Delete this blog?")) return;
    setDeletingId(blogId);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      if (activeBlog && activeBlog._id === blogId) handleCloseBlogPopup();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Stories by the Solos</h1>
            <p className={styles.subtitle}>
              Share your travel experiences and insights
            </p>
          </header>

          <main className={styles.blogGrid}>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading &&
              blogs.map((blog) => (
                <article className={styles.blogCard} key={blog._id}>
                  <h2
                    className={styles.blogTitle}
                    onClick={() => handleTileClick(blog)}
                  >
                    {blog.title}
                  </h2>
                  <p className={styles.blogExcerpt}>
                    {getTextFromHtml(blog.content).slice(0, 150)}...
                  </p>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
          </main>
        </div>

        <button className={styles.addBlogBtn} onClick={handleAddBlog}>
          Add Blog
        </button>
        {showEditor && (
          <div className={styles.editorOverlay}>
            <div className={styles.editorModal}>
              <h2>{editingBlog ? "Edit Blog" : "Create New Blog"}</h2>
              <div className={styles.inputGroup}>
                <label className={styles.editorLabel}>Title</label>
                <input
                  type="text"
                  className={styles.input}
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="My Awesome Adventure"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.editorLabel}>Content</label>
                <div className={styles.richEditor}>
                  <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={quillModules}
                    theme="snow"
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.editorLabel}>Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                {image && (
                  <img
                    src={image}
                    alt="preview"
                    style={{
                      maxWidth: "200px",
                      marginTop: "1rem",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </div>
              <div className={styles.editorActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={handleCloseEditor}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? editingBlog
                      ? "Updating..."
                      : "Saving..."
                    : editingBlog
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content Popup */}
        {activeBlog && (
          <div
            className={styles.blogPopupOverlay}
            onClick={handleCloseBlogPopup}
          >
            <div
              className={styles.blogPopupModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.blogPopupHeader}>
                <h1 className={styles.blogPopupTitle}>{activeBlog.title}</h1>
                <button
                  className={styles.blogPopupCloseBtn}
                  onClick={handleCloseBlogPopup}
                  aria-label="Close popup"
                >
                  ×
                </button>
              </div>

              {activeBlog.image && (
                <div className={styles.blogPopupImageContainer}>
                  <img
                    src={activeBlog.image}
                    alt={activeBlog.title}
                    className={styles.blogPopupImage}
                  />
                </div>
              )}

              <div className={styles.blogPopupContent}>
                <div
                  className={styles.blogPopupText}
                  dangerouslySetInnerHTML={{ __html: activeBlog.content }}
                />
              </div>

              <div className={styles.blogPopupFooter}>
                <p className={styles.blogPopupDate}>
                  Published:{" "}
                  {new Date(activeBlog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className={styles.blogPopupActions}>
                  <button
                    className={styles.blogPopupEditBtn}
                    onClick={() => {
                      handleCloseBlogPopup();
                      handleEdit(activeBlog);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.blogPopupDeleteBtn}
                    onClick={() => {
                      handleCloseBlogPopup();
                      handleDelete(activeBlog._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blog;
