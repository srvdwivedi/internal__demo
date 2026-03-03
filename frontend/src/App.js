import { useEffect, useState } from "react";

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

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ---------------------------
     Fetch Projects
  ----------------------------*/
  useEffect(() => {
    fetch(`${API}/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.value || []);
      });
  }, []);

  /* ---------------------------
     Fetch Repos when Project changes
  ----------------------------*/
  useEffect(() => {
    if (!selectedProject) return;

    fetch(`${API}/repos/${selectedProject}`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data.value || []);
      });
  }, [selectedProject]);

  /* ---------------------------
     Create Project
  ----------------------------*/
  const createProject = async () => {
    if (!newProjectName) {
      alert("Please enter a project name");
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
      alert(`Project creation started!\nOperation ID: ${data.operationId}\nStatus: ${data.status}`);
      setNewProjectName("");
      setNewProjectDesc("");
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  };

  /* ---------------------------
     Create Pipeline
  ----------------------------*/
  const createPipeline = async () => {
    if (!selectedProject || !selectedRepo || !pipelineName) {
      alert("Please fill all required fields");
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
      alert("Pipeline Created Successfully!");
    } else {
      alert("Error creating pipeline");
    }
  };

  /* ---------------------------
     Deploy Pipeline
  ----------------------------*/
  const deploy = async () => {
    if (!pipelineId) {
      alert("Create pipeline first");
      return;
    }

    setLoading(true);

    let parsedParameters = {};
    let parsedVariables = {};

    try {
      parsedParameters = JSON.parse(parameters);
    } catch {
      alert("Invalid JSON for parameters");
      setLoading(false);
      return;
    }

    try {
      parsedVariables = JSON.parse(variables);
    } catch {
      alert("Invalid JSON for variables");
      setLoading(false);
      return;
    }

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
    alert("Deployment Started!");
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2> Internal DevOps Automation Platform </h2>

      {/* Create Project */}
      <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
        <h3 style={{ marginTop: 0 }}>Create New Project</h3>
        <div>
          <input
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Description (optional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <button onClick={createProject} disabled={loading}>
            Create Project
          </button>
        </div>
      </div>

      {/* Project Selection */}
      <div>
        <label>Project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.name}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      {/* Repo Selection */}
      <div style={{ marginTop: 15 }}>
        <label>Repository:</label>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
        >
          <option value="">Select Repo</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pipeline Name */}
      <div style={{ marginTop: 15 }}>
        <input
          placeholder="Pipeline Name"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
        />
      </div>

      {/* Pipeline ID (for deploying existing pipelines) */}
      <div style={{ marginTop: 15 }}>
        <input
          placeholder="Pipeline ID (e.g. 6)"
          value={pipelineId}
          onChange={(e) => setPipelineId(e.target.value)}
        />
      </div>

      {/* Parameters (templateParameters) */}
      <div style={{ marginTop: 15 }}>
        <div style={{ marginBottom: 4, fontWeight: "bold" }}>Parameters (YAML template params):</div>
        <textarea
          rows="4"
          cols="50"
          placeholder='e.g. {"projectName": "my-app"}'
          value={parameters}
          onChange={(e) => setParameters(e.target.value)}
        />
      </div>

      {/* Variables */}
      <div style={{ marginTop: 15 }}>
        <div style={{ marginBottom: 4, fontWeight: "bold" }}>Variables (runtime):</div>
        <textarea
          rows="4"
          cols="50"
          placeholder='e.g. {"ENV": {"value": "prod"}}'
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={createPipeline} disabled={loading}>
          Create Pipeline
        </button>

        <button
          onClick={deploy}
          style={{ marginLeft: 10 }}
          disabled={loading}
        >
          Deploy
        </button>
      </div>
    </div>
  );
}

export default App;