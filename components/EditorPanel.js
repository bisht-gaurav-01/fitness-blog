
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function EditorPanel({ initialValue = "", onClose }) {
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(true);

  const markdownValue = value || "# Start writing...\n\n**Bold text**, *italic*, `inline code`\n\n```js\nfunction hello() {\n  console.log('Hello Markdown!');\n}\n```";

  return (
    <div className="editor">
      <div className="editor__header">
        <div>
          <h3 className="editor__title">Edit Post</h3>
          <p className="editor__subtitle">
            Markdown supported •{" "}
            <button
              className="editor__toggle-preview"
              type="button"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Code" : "Preview"}
            </button>
          </p>
        </div>
        <button 
          className="editor__close" 
          type="button" 
          onClick={onClose} 
          aria-label="Close editor"
        >
          Close
        </button>
      </div>

      <div className="editor__body">
        <div className={`editor__split ${!preview ? 'editor__split--full' : ''}`}>
          <div className="editor__pane">
            <div className="editor__pane-header">
              <span>Markdown</span>
            </div>
            <textarea
              className="editor__textarea"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={15}
              placeholder="Start writing in Markdown..."
              aria-label="Edit blog content"
            />
          </div>

          {preview && (
            <div className="editor__pane editor__preview">
              <div className="editor__pane-header">
                <span>Preview</span>
              </div>
              <div className="editor__preview-content">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {markdownValue}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="editor__actions">
        <button 
          className="editor__button editor__button--ghost" 
          type="button" 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className="editor__button" 
          type="button"
          onClick={() => {
            console.log("Saving:", value);
            onClose();
          }}
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}
