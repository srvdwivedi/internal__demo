import { useEffect, useState } from "react";

const THEME = "#f17322";
const THEME_DARK = "#c95e1a";
const THEME_LIGHT = "#fff4ee";

const styles = {
  root: {
    margin: 0,
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "#f5f6fa",
    minHeight: "100vh",
    color: "#222",
  },
  navbar: {
    background: THEME,
    padding: "0 36px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  navLogo: {
    width: 34,
    height: 34,
    background: "#fff",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 18,
    color: THEME,
    letterSpacing: -1,
  },
  navTitle: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  navSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginLeft: 2,
  },
  navBadge: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    fontSize: 12,
    padding: "3px 12px",
    borderRadius: 20,
    fontWeight: 500,
  },
  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "36px 24px 60px",
  },
  pageHeader: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  pageSubtitle: {
    color: "#666",
    fontSize: 14,
    marginTop: 6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #ebebeb",
  },
  cardFull: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #ebebeb",
    marginTop: 24,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
    paddingBottom: 14,
    borderBottom: "1px solid #f0f0f0",
  },
  cardIcon: {
    width: 36,
    height: 36,
    background: THEME_LIGHT,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  cardDesc: {
    fontSize: 12,
    color: "#888",
    margin: "2px 0 0",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: 7,
    fontSize: 14,
    color: "#222",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: 7,
    fontSize: 14,
    color: "#222",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: 7,
    fontSize: 13,
    fontFamily: "monospace",
    color: "#222",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },
  btnPrimary: {
    background: THEME,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "10px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    width: "100%",
  },
  btnSecondary: {
    background: "#fff",
    color: THEME,
    border: `2px solid ${THEME}`,
    borderRadius: 7,
    padding: "9px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    width: "100%",
  },
  btnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 8,
  },
  toast: {
    position: "fixed",
    bottom: 28,
    right: 28,
    background: "#1a1a2e",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
    zIndex: 999,
    maxWidth: 340,
    borderLeft: `4px solid ${THEME}`,
    animation: "slideIn 0.25s ease",
  },
  toastError: {
    borderLeft: "4px solid #e74c3c",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f0f0f0",
    margin: "18px 0",
  },
  pipelineIdBadge: {
    display: "inline-block",
    background: THEME_LIGHT,
    color: THEME_DARK,
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    marginLeft: 8,
  },
  spinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    marginRight: 8,
    verticalAlign: "middle",
  },
};

function Toast({ message, isError, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ ...styles.toast, ...(isError ? styles.toastError : {}) }}>
      {message}
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [pipelineName, setPipelineName] = useState("");
  const [parameters, setParameters] = useState("{}");
  const [variables, setVariables] = useState("{}");
  const [pipelineId, setPipelineId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const showToast = (message, isError = false) => setToast({ message, isError });

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data.value || []));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    fetch(`${API}/repos/${selectedProject}`)
      .then((res) => res.json())
      .then((data) => setRepos(data.value || []));
  }, [selectedProject]);

  const createProject = async () => {
    if (!newProjectName) {
      showToast("Please enter a project name", true);
      return;
    }
    setLoading(true);
    const response = await fetch(`${API}/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: newProjectName,
        description: newProjectDesc,
        visibility: "private",
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.operationId) {
      showToast(`Project creation started — Operation ID: ${data.operationId}`);
      setNewProjectName("");
      setNewProjectDesc("");
    } else {
      showToast("Error: " + (data.error || "Unknown error"), true);
    }
  };

  const createPipeline = async () => {
    if (!selectedProject || !selectedRepo || !pipelineName) {
      showToast("Please fill all required fields", true);
      return;
    }
    setLoading(true);
    const repo = repos.find((r) => r.id === selectedRepo);
    const response = await fetch(`${API}/pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: selectedProject,
        pipelineName,
        repoId: repo.id,
        repoName: repo.name,
        yamlPath: "/azure-pipelines.yml",
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.pipeline?.id) {
      setPipelineId(data.pipeline.id);
      showToast("Pipeline created successfully!");
    } else {
      showToast("Error creating pipeline", true);
    }
  };

  const deploy = async () => {
    if (!pipelineId) {
      showToast("Create a pipeline first", true);
      return;
    }
    let parsedParameters = {};
    let parsedVariables = {};
    try {
      parsedParameters = JSON.parse(parameters);
    } catch {
      showToast("Invalid JSON in Parameters field", true);
      return;
    }
    try {
      parsedVariables = JSON.parse(variables);
    } catch {
      showToast("Invalid JSON in Variables field", true);
      return;
    }
    setLoading(true);
    await fetch(`${API}/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: selectedProject,
        pipelineId,
        parameters: parsedParameters,
        variables: parsedVariables,
      }),
    });
    setLoading(false);
    showToast("Deployment triggered successfully!");
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f6fa; }
        input:focus, select:focus, textarea:focus {
          border-color: ${THEME} !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px ${THEME_LIGHT};
        }
        button:hover:not(:disabled) { opacity: 0.88; }
        button:disabled { opacity: 0.55; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>C</div>
          <div>
            <div style={styles.navTitle}>Content Active</div>
            <div style={styles.navSubtitle}>Internal DevOps Portal</div>
          </div>
        </div>
        <div style={styles.navBadge}>Azure DevOps Automation</div>
      </nav>

      {/* Page */}
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Deployment Portal</h1>
          <p style={styles.pageSubtitle}>
            Create projects, configure pipelines, and trigger deployments to Vercel.
          </p>
        </div>

        <div style={styles.grid}>
          {/* Card: Create Project */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>📁</div>
              <div>
                <p style={styles.cardTitle}>Create New Project</p>
                <p style={styles.cardDesc}>Provision an Azure DevOps project</p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Project Name *</label>
              <input
                style={styles.input}
                placeholder="e.g. my-react-app"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input
                style={styles.input}
                placeholder="Optional description"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
            </div>
            <button style={styles.btnPrimary} onClick={createProject} disabled={loading}>
              {loading ? <span style={styles.spinner} /> : null}
              Create Project
            </button>
          </div>

          {/* Card: Pipeline Setup */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>⚙️</div>
              <div>
                <p style={styles.cardTitle}>Pipeline Setup</p>
                <p style={styles.cardDesc}>Link a repo and create a pipeline</p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Project *</label>
              <select
                style={styles.select}
                value={selectedProject}
                onChange={(e) => { setSelectedProject(e.target.value); setSelectedRepo(""); }}
              >
                <option value="">Select a project</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.name}>{proj.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Repository *</label>
              <select
                style={styles.select}
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                disabled={!selectedProject}
              >
                <option value="">Select a repository</option>
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.id}>{repo.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pipeline Name *</label>
              <input
                style={styles.input}
                placeholder="e.g. production-deploy"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
              />
            </div>

            <button style={styles.btnPrimary} onClick={createPipeline} disabled={loading}>
              {loading ? <span style={styles.spinner} /> : null}
              Create Pipeline
            </button>
          </div>
        </div>

        {/* Card: Deploy */}
        <div style={styles.cardFull}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>🚀</div>
            <div style={{ flex: 1 }}>
              <p style={styles.cardTitle}>
                Trigger Deployment
                {pipelineId && (
                  <span style={styles.pipelineIdBadge}>Pipeline ID: {pipelineId}</span>
                )}
              </p>
              <p style={styles.cardDesc}>Run a pipeline with custom parameters and variables</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Pipeline ID</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 6  (auto-filled after Create Pipeline)"
                  value={pipelineId}
                  onChange={(e) => setPipelineId(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Parameters (YAML template params)</label>
                <textarea
                  style={{ ...styles.textarea, minHeight: 100 }}
                  placeholder={'{\n  "projectName": "my-app",\n  "environment": "production"\n}'}
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Variables (runtime overrides)</label>
                <textarea
                  style={{ ...styles.textarea, minHeight: 150 }}
                  placeholder={'{\n  "ENV": { "value": "prod" }\n}'}
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={{ maxWidth: 240 }}>
            <button
              style={{ ...styles.btnPrimary, background: loading ? "#aaa" : THEME_DARK }}
              onClick={deploy}
              disabled={loading}
            >
              {loading ? <span style={styles.spinner} /> : null}
              Trigger Deployment
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;