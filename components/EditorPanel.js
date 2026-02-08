import { useState } from "react";

export default function EditorPanel({ initialValue = "", onClose }) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="editor">
      <div className="editor__header">
        <div>
          <h3 className="editor__title">Edit Post</h3>
          <p className="editor__subtitle">Markdown supported</p>
        </div>
        <button className="editor__close" type="button" onClick={onClose} aria-label="Close editor">
          Close
        </button>
      </div>
      <textarea
        className="editor__textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={8}
        aria-label="Edit blog content"
      />
      <div className="editor__actions">
        <button className="editor__button editor__button--ghost" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="editor__button" type="button">
          Save Draft
        </button>
      </div>
    </div>
  );
}
