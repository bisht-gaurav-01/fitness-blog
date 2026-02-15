import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/Layout";
import content from "../../data/content.json";

const EditorPanel = dynamic(() => import("../../components/EditorPanel"), {
  ssr: false,
  loading: () => (
    <div className="editor">
      <p className="editor__subtitle">Loading editor...</p>
    </div>
  ),
});

const ratingOptions = [
  { icon: "fa-face-angry", label: "Bad", value: 1.0, color: "#ec4747" },
  { icon: "fa-face-frown", label: "Average", value: 2.0, color: "#fb923c" },
  { icon: "fa-face-meh", label: "Normal", value: 3.0, color: "#fbbf24" },
  { icon: "fa-face-smile", label: "Nice", value: 4.0, color: "#3376f3" },
  { icon: "fa-face-laugh", label: "Good", value: 5.0, color: "#a3e635" },
];

const initialFormState = {
  name: "",
  email: "",
  comment: "",
  rating: 4,
};

const emojis = [
  { icon: "😞", value: 1, label: "Poor" },
  { icon: "🙁", value: 2, label: "Bad" },
  { icon: "😐", value: 3, label: "Okay" },
  { icon: "🙂", value: 4, label: "Good" },
  { icon: "😊", value: 5, label: "Great" },
];
export default function BlogPost({
  post,
  sidebarPosts,
  tourGuides,
  relatedArticles,
}) {
  const mountedRef = useRef(true);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    comment: false,
  });
  const [submitState, setSubmitState] = useState("idle");
  const [commentsState, setCommentsState] = useState({
    status: "loading",
    data: [],
    error: "",
  });

  const loadComments = async () => {
    setCommentsState({ status: "loading", data: [], error: "" });
    try {
      const response = await fetch(`/api/comments?slug=${post.slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      if (mountedRef.current) {
        setCommentsState({
          status: "success",
          data: data.comments || [],
          error: "",
        });
      }
    } catch (error) {
      if (mountedRef.current) {
        setCommentsState({
          status: "error",
          data: [],
          error: "Unable to load comments.",
        });
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadComments();
    return () => {
      mountedRef.current = false;
    };
  }, [post.slug]);

  const errors = useMemo(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    return {
      name: formData.name.trim().length < 2 ? "Please enter your name." : "",
      email: !emailValid ? "Please enter a valid email address." : "",
      comment:
        formData.comment.trim().length < 10
          ? "Please add a longer comment."
          : "",
    };
  }, [formData]);

  const isValid = !errors.name && !errors.email && !errors.comment;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, comment: true });

    if (!isValid) {
      setSubmitState("idle");
      return;
    }

    setSubmitState("submitting");

    const newComment = {
      id: Date.now(),
      name: formData.name.trim(),
      rating: Number(formData.rating).toFixed(1), //parseFloat(formData.rating),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      text: formData.comment.trim(),
    };

    setCommentsState((prev) => ({
      status: "success",
      data: [newComment, ...(prev.data || [])],
      error: "",
    }));

    setTimeout(() => {
      setSubmitState("success");
      setFormData(initialFormState);
      setTouched({ name: false, email: false, comment: false });
      setTimeout(() => setSubmitState("idle"), 2500);
    }, 1000);
  };

  const editorValue = [post.intro, ...post.body, ...post.highlights].join(
    "\n\n",
  );

  return (
    <Layout>
      <div className="blog">
        <p className="blog__breadcrumb">Home / Articles /</p>
        <h1 className="blog__title">{post.title}</h1>

        <div className="blog__hero">
          <div className="blog__hero-frame">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="blog__hero-image"
            />
          </div>
        </div>

        <div className="blog__meta">
          <div className="blog__author">
            <div className="blog__avatar">
              <Image src={post.author.avatar} alt={post.author.name} fill />
            </div>
            <span>{post.author.name}</span>
          </div>
          <span>{post.date}</span>
        </div>

        <div className="blog__content-grid">
          <article className="blog__article">
            <p className="blog__lead">{post.intro}</p>
            {post.body.map((paragraph, index) => (
              <p key={`paragraph-${index}`}>{paragraph}</p>
            ))}
            {post.highlights.map((text, index) => (
              <div key={`highlight-${index}`} className="blog__quote">
                {text}
              </div>
            ))}
            {post.body.map((paragraph, index) => (
              <p key={`paragraph-${index}`}>{paragraph}</p>
            ))}
            <div className="blog__about">
              <p className="blog__about-title">About {post.author.name}</p>
              <div className="blog__about-body">
                <div className="blog__avatar blog__avatar--large">
                  <Image src={post.author.avatar} alt={post.author.name} fill />
                </div>
                <p>{post.about}</p>
              </div>
            </div>

            <div className="blog__nav">
              <button className="blog__nav-button" href={`#`}>
                <span>
                  <i
                    className="fa fa-arrow-circle-o-left"
                    aria-hidden="true"
                  ></i>
                </span>{" "}
                Previous
              </button>
              <span>{post.prev.title}</span>
              <button className="blog__nav-button" href={``}>
                Next
                <span>
                  <i
                    className="fa fa-arrow-circle-o-right"
                    aria-hidden="true"
                  ></i>
                </span>
              </button>
            </div>

            <button
              className="blog__edit-toggle"
              type="button"
              onClick={() => setShowEditor((prev) => !prev)}
            >
              {showEditor ? "Hide editor" : "Edit"}
            </button>
            {showEditor ? (
              <EditorPanel
                initialValue={editorValue}
                onClose={() => setShowEditor(false)}
              />
            ) : null}

            <section>
              <h2 className="blog__section-title">Comments</h2>
              {commentsState.status === "loading" ? (
                <div className="blog__comment-list" aria-live="polite">
                  {[0, 1].map((item) => (
                    <div
                      key={`skeleton-${item}`}
                      className="blog__comment-skeleton"
                    >
                      <div className="skeleton skeleton--avatar" />
                      <div style={{ flex: 1, display: "grid", gap: 8 }}>
                        <div
                          className="skeleton skeleton--line"
                          style={{ width: "40%" }}
                        />
                        <div
                          className="skeleton skeleton--line"
                          style={{ width: "60%" }}
                        />
                        <div
                          className="skeleton skeleton--line"
                          style={{ width: "90%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              {commentsState.status === "error" ? (
                <div className="blog__error-box" role="alert">
                  <span>{commentsState.error}</span>
                  <button
                    className="blog__retry"
                    type="button"
                    onClick={loadComments}
                  >
                    Retry
                  </button>
                </div>
              ) : null}
              {commentsState.status === "success" ? (
                <>
                  {commentsState.data.length === 0 ? (
                    <p className="blog__muted">
                      No comments yet. Be the first to share your thoughts.
                    </p>
                  ) : (
                    <div className="blog__comment-list">
                      {commentsState.data.map((comment) => (
                        <div key={comment.id} className="blog__comment">
                          <div className="blog__comment-avatar">
                            {comment.name[0]}
                          </div>
                          <div>
                            <div className="blog__comment-meta">
                              <span>{comment.name}</span>
                              <div className="blog__stars-with-number">
                                <div className="blog__stars">
                                  {[...Array(5)].map((_, index) => (
                                    <span
                                      key={`star-${index}`}
                                      className={`blog__star ${index < Math.floor(comment.rating) ? "blog__star--filled" : "blog__star--empty"}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="blog__rating-number">
                                  ({comment.rating})
                                </span>
                              </div>
                            </div>

                            <div className="blog__comment-date">
                              {comment.date}
                            </div>
                            <p className="blog__comment-text">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </section>

            <section>
              <h2 className="blog__section-title">Add A Comment</h2>
              <form className="blog__form" onSubmit={handleSubmit} noValidate>
                <div className="blog__form-grid">
                  <label className="blog__label">
                    Name
                    <input
                      className={`blog__input ${touched.name && errors.name ? "blog__input--error" : ""}`}
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, name: true }))
                      }
                      aria-invalid={touched.name && !!errors.name}
                    />
                    {touched.name && errors.name ? (
                      <span className="blog__error">{errors.name}</span>
                    ) : null}
                  </label>
                  <label className="blog__label">
                    Comment
                    <textarea
                      className={`blog__textarea ${touched.comment && errors.comment ? "blog__textarea--error" : ""}`}
                      value={formData.comment}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          comment: event.target.value,
                        }))
                      }
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, comment: true }))
                      }
                      aria-invalid={touched.comment && !!errors.comment}
                      placeholder="Search Anything..."
                    />
                    {touched.comment && errors.comment ? (
                      <span className="blog__error">{errors.comment}</span>
                    ) : null}
                  </label>
                </div>
                <label className="blog__label">
                  Email
                  <input
                    className={`blog__input ${touched.email && errors.email ? "blog__input--error" : ""}`}
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                    aria-invalid={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email ? (
                    <span className="blog__error">{errors.email}</span>
                  ) : null}
                </label>

                <div className="blog__form-footer">
                  <div>
                    <div className="blog__label">
                      Rate The Usefulness Of The Article
                    </div>
                    <br />
                    <div className="blog__rating">
                      <div className="blog__emoji-rating">
                        {ratingOptions.map((emoji) => (
                          <button
                            key={emoji.value}
                            type="button"
                            aria-label={emoji.label}
                            className={`blog__emoji-btn ${
                              formData.rating === emoji.value
                                ? "blog__emoji-btn--active"
                                : ""
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                rating: emoji.value,
                              }))
                            }
                          >
                            <i
                              className={`fa-solid ${emoji.icon}`}
                              style={{ color: emoji.color }}
                            ></i>
                          </button>
                        ))}
                      </div>

                      <span
                        className="blog__rating-label"
                        style={{
                          backgroundColor: ratingOptions.find(
                            (e) => e.value === formData.rating,
                          )?.color,
                          color: "#ffffff",
                        }}
                      >
                        {
                          ratingOptions.find((e) => e.value === formData.rating)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>
                  <button
                    className="blog__submit"
                    type="submit"
                    disabled={submitState === "submitting"}
                  >
                    <i className="fa fa-commenting-o" aria-hidden="true"></i>
                    &nbsp;
                    {submitState === "submitting" ? "Sending" : "Send"}
                  </button>
                </div>

                {submitState === "success" ? (
                  <div className="blog__success">
                    Thanks for your comment! We will review it shortly.
                  </div>
                ) : null}
              </form>
            </section>
          </article>

          <aside className="blog__sidebar">
            <div className="blog__sidebar-section">
              <h3 className="blog__sidebar-title">Explore more</h3>
              {sidebarPosts.map((item) => (
                <article
                  className="blog__sidebar-card"
                  key={`${item.title}-${item.date}`}
                >
                  <div className="blog__sidebar-image">
                    <Image src={item.image} alt={item.title} fill />
                  </div>
                  <div className="blog__sidebar-meta">
                    <span style={{ color: "#090909" }}> {item.category}</span>&nbsp;&nbsp;|&nbsp;
                    <span style={{ color: "#5c6270" }}>{item.date}</span>
                  </div>
                  <div className="blog__sidebar-text">{item.title}</div>
                </article>
              ))}
            </div>
            <br></br>
            <br></br>

            <div className="blog__sidebar-section blog__sidebar-box">
              <h3 className="blog__sidebar-title">Tour Guides</h3>
              {tourGuides.map((guide) => (
                <div key={guide.name} className="blog__guide">
                  <div className="blog__guide-avatar">
                    {guide.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="blog__guide-name">{guide.name}</div>
                    <div className="blog__guide-meta">
                      <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                      &nbsp;
                      {guide.location}
                    </div>
                  </div>

                  <div className="blog__guide-rating">
                    <div className="blog__stars-container">
                      <div className="blog__stars">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={`gstar-${index}`}
                            className={`blog__star ${index < Math.floor(guide.rating) ? "blog__star--filled" : "blog__star--empty"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="blog__rating-number">
                        ({guide.rating})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="blog__related">
          <h2 className="blog__related-title">Related articles</h2>
          <div className="blog__related-grid">
            {relatedArticles.map((article) => (
              <article key={article.title} className="blog__related-card">
                <Link href={`/blog/${article.slug}`}>
                  <div className="blog__related-image">
                    <Image src={article.image} alt={article.title} fill />
                  </div>
                  <h3>{article.title}</h3>
                </Link>
                <p className="blog__related-excerpt">{article.excerpt}</p>
                <div className="blog__related-author">{article.author}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = content.posts.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = content.posts.find((entry) => entry.slug === params.slug);
  if (!post) {
    return { notFound: true };
  }
  return {
    props: {
      post,
      sidebarPosts: content.sidebarPosts,
      tourGuides: content.tourGuides,
      relatedArticles: content.relatedArticles,
    },
  };
}
