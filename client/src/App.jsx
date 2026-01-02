import { useState } from "react";

export default function App() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [ttlError, setTtlError] = useState("");
  const [maxViewsError, setMaxViewsError] = useState("");

  const createPaste = async () => {
    setError("");
    setTtlError("");
    setMaxViewsError("");

    const body = { content };

    if (ttlSeconds !== "") {
      const n = Number(ttlSeconds);
      if (!Number.isInteger(n) || n <= 1) {
        setTtlError("TTL must be greater than 1 second");
        return;
      }
      body.ttlSeconds = n;
    }

    if (maxViews !== "") {
      const m = Number(maxViews);
      if (!Number.isInteger(m) || m <= 1) {
        setMaxViewsError("Max views must be greater than 1");
        return;
      }
      body.maxViews = m;
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pastes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to create paste");
      return;
    }

    const data = await res.json();
    setUrl(data.url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerContainer}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>SecurePaste</h1>
            <p style={styles.subtitle}>
              Share sensitive information with expiration and view limits
            </p>
            <div style={styles.divider}></div>
          </div>

          {/* Content Section */}
          <div style={styles.contentSection}>
            <h2 style={styles.contentTitle}>Your Content</h2>
            <div style={styles.textareaContainer}>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste your content here..."
                style={styles.textarea}
              />
            </div>
            <div style={styles.charCount}>
              {content.length} characters
            </div>
          </div>

          {/* Settings Table */}
          <div style={styles.settingsTable}>
            <div style={styles.tableRow}>
              <div style={styles.tableHeader}>
                <div style={styles.tableCell}>
                  <label style={styles.tableLabel}>Time to Live</label>
                </div>
                <div style={styles.tableCell}>
                  <label style={styles.tableLabel}>Max Views</label>
                </div>
              </div>
            </div>
            <div style={styles.tableRow}>
              <div style={styles.tableData}>
                <div style={styles.tableCell}>
                  <input
                    type="number"
                    value={ttlSeconds}
                    onChange={(e) => {
                      setTtlSeconds(e.target.value);
                      setTtlError("");
                    }}
                    placeholder="Seconds"
                    style={styles.tableInput}
                    min="2"
                    step="1"
                  />
                  {ttlError && <div style={styles.error}>{ttlError}</div>}
                </div>
              </div>
              <div style={styles.tableData}>
                <div style={styles.tableCell}>
                  <input
                    type="number"
                    value={maxViews}
                    onChange={(e) => {
                      setMaxViews(e.target.value);
                      setMaxViewsError("");
                    }}
                    placeholder="Number"
                    style={styles.tableInput}
                    min="2"
                    step="1"
                  />
                  {maxViewsError && <div style={styles.error}>{maxViewsError}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div style={styles.buttonContainer}>
            <button 
              style={{
                ...styles.createButton,
                ...(!content.trim() ? styles.createButtonDisabled : {})
              }} 
              onClick={createPaste}
              disabled={!content.trim()}
            >
              Create Paste
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <div style={styles.errorIcon}>⚠️</div>
              <div style={styles.errorText}>{error}</div>
            </div>
          )}

          {/* Success Result */}
          {url && (
            <div style={styles.resultBox}>
              <div style={styles.successHeader}>
                <div style={styles.successIcon}>✅</div>
                <div style={styles.successTitle}>Paste Created Successfully!</div>
              </div>
              <div style={styles.urlContainer}>
                <div style={styles.urlLabel}>Shareable URL:</div>
                <div style={styles.urlWrapper}>
                  <a href={url} target="_blank" rel="noreferrer" style={styles.link}>
                    {url}
                  </a>
                  <button 
                    style={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      const btn = document.querySelector('.copyButton');
                      if (btn) {
                        btn.textContent = 'Copied!';
                        setTimeout(() => btn.textContent = 'Copy', 2000);
                      }
                    }}
                    className="copyButton"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div style={styles.featuresSection}>
            <h3 style={styles.featuresTitle}>Why SecurePaste?</h3>
            <div style={styles.featuresGrid}>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>🔒</div>
                <div style={styles.featureTitle}>Secure by Design</div>
                <div style={styles.featureDesc}>
                  No accounts required. Your content is encrypted and accessible only via unique, random URLs.
                </div>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>⏰</div>
                <div style={styles.featureTitle}>Auto-Expiration (TTL)</div>
                <div style={styles.featureDesc}>
                  Set Time To Live in seconds. Your paste automatically deletes after expiration, ensuring no lingering data.
                </div>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>👁️</div>
                <div style={styles.featureTitle}>View Limits</div>
                <div style={styles.featureDesc}>
                  Control exactly how many times your content can be viewed. Perfect for one-time sharing of sensitive info.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  
  centerContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    padding: "40px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  },
  
  header: {
    marginBottom: "28px",
  },
  
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 10px 0",
    letterSpacing: "-0.5px",
  },
  
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },
  
  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    width: "100%",
  },
  
  contentSection: {
    marginBottom: "28px",
    textAlign: "left",
  },
  
  contentTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#334155",
    margin: "0 0 10px 0",
  },
  
  textareaContainer: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    backgroundColor: "#ffffff",
  },
  
  textarea: {
    width: "100%",
    height: "100%",
    padding: "14px",
    fontSize: "14px",
    lineHeight: "1.5",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    resize: "none",
    fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    outline: "none",
  },
  
  charCount: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "8px",
    textAlign: "right",
    fontWeight: "500",
  },
  
  // Table Styles
  settingsTable: {
    width: "100%",
    marginBottom: "28px",
    borderCollapse: "separate",
    borderSpacing: "0",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  
  tableRow: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
  },
  
  tableRowLast: {
    borderBottom: "none",
  },
  
  tableHeader: {
    display: "flex",
    width: "100%",
    backgroundColor: "#f8fafc",
  },
  
  tableData: {
    display: "flex",
    width: "100%",
  },
  
  tableCell: {
    flex: "1",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
  },
  
  tableLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
    textAlign: "left",
  },
  
  tableInput: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    WebkitAppearance: "textfield",
    MozAppearance: "textfield",
    appearance: "textfield",
  },
  
  error: {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "6px",
    fontWeight: "500",
    textAlign: "left",
  },
  
  buttonContainer: {
    marginBottom: "24px",
  },
  
  createButton: {
    padding: "14px 40px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "180px",
  },
  
  createButtonDisabled: {
    opacity: "0.6",
    cursor: "not-allowed",
    backgroundColor: "#94a3b8",
  },
  
  errorBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px 20px",
    backgroundColor: "#fef2f2",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    marginBottom: "20px",
  },
  
  errorIcon: {
    fontSize: "16px",
  },
  
  errorText: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "500",
  },
  
  resultBox: {
    padding: "20px",
    backgroundColor: "#f0f9ff",
    borderRadius: "10px",
    border: "1px solid #bae6fd",
    textAlign: "left",
    marginBottom: "32px",
  },
  
  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  
  successIcon: {
    fontSize: "18px",
  },
  
  successTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0369a1",
  },
  
  urlContainer: {
    backgroundColor: "#ffffff",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  
  urlLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
  },
  
  urlWrapper: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  
  link: {
    flex: "1",
    color: "#4f46e5",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: "500",
    wordBreak: "break-all",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  
  copyButton: {
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    whiteSpace: "nowrap",
  },

  // Features Section Styles
  featuresSection: {
    marginTop: "32px",
    paddingTop: "32px",
    borderTop: "1px solid #e2e8f0",
    textAlign: "left",
  },

  featuresTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "24px",
    textAlign: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  feature: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    transition: "all 0.2s ease",
  },

  featureIcon: {
    fontSize: "28px",
    marginBottom: "12px",
  },

  featureTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },

  featureDesc: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },
};

// Add CSS for better table appearance and hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  * {
    box-sizing: border-box;
  }
  
  /* Fix text visibility */
  textarea, .tableInput {
    color: #1e293b !important;
  }
  
  textarea::placeholder, .tableInput::placeholder {
    color: #94a3b8 !important;
    opacity: 0.8;
  }
  
  textarea:focus, .tableInput:focus {
    outline: none;
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
  
  .createButton:hover:not(:disabled) {
    background-color: #4338ca !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  .copyButton:hover {
    background-color: #4338ca !important;
  }
  
  a:hover {
    color: #3730a3 !important;
    text-decoration: underline;
  }
  
  textarea:hover, .tableInput:hover {
    border-color: #c7d2fe !important;
  }
  
  .createButton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Table cell borders */
  .tableCell:first-child {
    border-right: 1px solid #e2e8f0;
  }
  
  /* Textarea scrollbar styling */
  .textareaContainer textarea {
    overflow-y: auto;
  }
  
  .textareaContainer textarea::-webkit-scrollbar {
    width: 8px;
  }
  
  .textareaContainer textarea::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  .textareaContainer textarea::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  .textareaContainer textarea::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Ensure input numbers are visible and show arrows */
  input[type="number"] {
    color: #1e293b !important;
  }
  
  /* Show number input arrows in all browsers */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    opacity: 1;
    height: 24px;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  /* Feature hover effects */
  .feature:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
    border-color: #c7d2fe;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .tableRow {
      flex-direction: column;
    }
    
    .tableCell:first-child {
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .settingsTable {
      border-radius: 12px;
      overflow: hidden;
    }
    
    .card {
      padding: 28px 16px;
    }
    
    .textareaContainer {
      height: 180px;
    }
    
    .createButton {
      minWidth: 160px;
      padding: 12px 32px;
    }
    
    .featuresGrid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .featuresSection {
      padding-top: 24px;
      margin-top: 24px;
    }
  }
`;
document.head.appendChild(styleSheet);

// Also add the CSS for proper centering
const centeringStyles = document.createElement('style');
centeringStyles.textContent = `
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8fafc;
  }
  
  #root {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
`;
document.head.appendChild(centeringStyles);