import React, { useState, useRef } from "react";
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
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddBlog = () => setShowEditor(true);

  const handleCloseEditor = () => {
    setShowEditor(false);
    setBlogTitle("");
    setEditorContent("");
    setImage(null);
  };

  const handleSave = () => {
    if (!blogTitle.trim() || !editorContent.trim()) return;
    setBlogs([
      {
        title: blogTitle,
        content: editorContent,
        image,
      },
      ...blogs,
    ]);
    handleCloseEditor();
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
    document.body.style.overflow = "hidden";
  };

  const handleCloseBlogPopup = () => {
    setActiveBlog(null);
    document.body.style.overflow = "";
  };

  return (
    <div className={styles.blogPage}>
      <h1 className={styles.title}>Stories by the Solos</h1>
      <div className={styles.tilesContainer}>
        {blogs.length === 0 && (
          <>
            <div className={styles.blogTile}></div>
            <div className={styles.blogTile}></div>
            <div className={styles.blogTile}></div>
          </>
        )}
        {blogs.map((blog, idx) => (
          <div
            className={styles.blogTile}
            key={idx}
            onClick={() => handleTileClick(blog)}
            tabIndex={0}
            role="button"
          >
            <h2 className={styles.blogTileTitle}>{blog.title}</h2>
            <div className={styles.blogTileContentPreview}>
              {getTextFromHtml(blog.content).slice(0, 180)}
              {getTextFromHtml(blog.content).length > 180 && "..."}
            </div>
            {blog.image && (
              <img
                src={blog.image}
                alt="blog"
                className={styles.blogTileImagePreview}
              />
            )}
          </div>
        ))}
      </div>
      <button className={styles.addBlogBtn} onClick={handleAddBlog}>
        Add Blog
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
                  background: "#f8fafc",
                  border: "1.5px solid #a5b4fc",
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
                    background: "#f8fafc",
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
              <button onClick={handleCloseEditor} className={styles.cancelBtn}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;