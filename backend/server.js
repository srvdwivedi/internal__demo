import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const org = process.env.AZURE_ORG;
const pat = process.env.AZURE_PAT;
const port = process.env.PORT || 5000;

console.log("🚀 Starting Azure DevOps Automation Server...", { org, port });

if (!org || !pat) {
  console.error("❌ Missing AZURE_ORG or AZURE_PAT in environment");
}

const authHeader =
  "Basic " + Buffer.from(":" + pat).toString("base64");

const baseHeaders = {
  "Content-Type": "application/json",
  Authorization: authHeader,
};

/* ============================================================
   🔹 Azure API Helper
============================================================ */
const azureRequest = async (url, method = "GET", body = null) => {
  const response = await fetch(url, {
    method,
    headers: baseHeaders,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await response.text();

  console.log("===== AZURE STATUS =====", response.status);
  console.log("================================");

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    throw new Error(
      `Azure returned non-JSON response. Status: ${response.status}. Body: ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Azure API Error ${response.status}: ${JSON.stringify(data)}`
    );
  }

  return data;
};

/* ============================================================
   1️⃣ List Projects
============================================================ */
/* ============================================================
   0️⃣ Create Project
============================================================ */
app.post("/project", async (req, res) => {
  try {
    const { projectName, description, visibility = "private" } = req.body;

    const url = `https://dev.azure.com/${org}/_apis/projects?api-version=7.0`;

    const body = {
      name: projectName,
      description: description || "",
      visibility,
      capabilities: {
        versioncontrol: { sourceControlType: "Git" },
        processTemplate: {
          templateTypeId: "6b724908-ef14-45cf-84f8-768b5384da45", // Agile
        },
      },
    };

    const data = await azureRequest(url, "POST", body);

    res.json({
      message: "Project creation started",
      operationId: data.id,
      status: data.status,
      url: data.url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   0️⃣b Check Project Creation Status
============================================================ */
app.get("/project-status/:operationId", async (req, res) => {
  try {
    const { operationId } = req.params;

    const url = `https://dev.azure.com/${org}/_apis/operations/${operationId}?api-version=7.0`;

    const data = await azureRequest(url);

    res.json({
      operationId,
      status: data.status,       // notSet | queued | inProgress | cancelled | succeeded | failed
      resultMessage: data.resultMessage || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const url = `https://dev.azure.com/${org}/_apis/projects?api-version=7.0`;
    const data = await azureRequest(url);
    console.log('data', data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   2️⃣ List Repositories
============================================================ */
app.get("/repos/:project", async (req, res) => {
  try {
    const { project } = req.params;
    const url = `https://dev.azure.com/${org}/${project}/_apis/git/repositories?api-version=7.0`;
    const data = await azureRequest(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   3️⃣ Create Repository
============================================================ */
app.post("/repo", async (req, res) => {
  try {
    const { project, repoName } = req.body;

    const url = `https://dev.azure.com/${org}/${project}/_apis/git/repositories?api-version=7.0`;

    const body = { name: repoName };

    const data = await azureRequest(url, "POST", body);

    res.json({
      message: "Repository created successfully",
      repository: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   4️⃣ Create Variable Group
============================================================ */
app.post("/variable-group", async (req, res) => {
  try {
    const { project, groupName, variables } = req.body;

    const formattedVariables = {};
    Object.keys(variables).forEach((key) => {
      formattedVariables[key] = {
        value: variables[key].value,
        isSecret: variables[key].isSecret || false,
      };
    });

    const url = `https://dev.azure.com/${org}/${project}/_apis/distributedtask/variablegroups?api-version=7.0-preview.2`;

    const body = {
      type: "Vsts",
      name: groupName,
      variables: formattedVariables,
    };

    const data = await azureRequest(url, "POST", body);

    res.json({
      message: "Variable group created",
      variableGroup: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   5️⃣ Update Variable Group
============================================================ */
app.put("/variable-group/:project/:groupId", async (req, res) => {
  try {
    const { project, groupId } = req.params;
    const { groupName, variables } = req.body;

    const formattedVariables = {};
    Object.keys(variables).forEach((key) => {
      formattedVariables[key] = {
        value: variables[key].value,
        isSecret: variables[key].isSecret || false,
      };
    });

    const url = `https://dev.azure.com/${org}/${project}/_apis/distributedtask/variablegroups/${groupId}?api-version=7.0-preview.2`;

    const body = {
      id: groupId,
      type: "Vsts",
      name: groupName,
      variables: formattedVariables,
    };

    const data = await azureRequest(url, "PUT", body);

    res.json({
      message: "Variable group updated",
      variableGroup: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   6️⃣ Create Pipeline
============================================================ */
app.post("/pipeline", async (req, res) => {
  try {
    const { project, pipelineName, repoId, repoName, yamlPath, repoType, serviceConnectionId } =
      req.body;

    const url = `https://dev.azure.com/${org}/${project}/_apis/pipelines?api-version=7.0`;

    const isGitHub = repoType === "gitHub";
    const isBitbucket = repoType === "bitbucket";

    let repository;
    if (isGitHub) {
      repository = {
        id: repoName,           // GitHub: "owner/repo"
        name: repoName,
        type: "gitHub",
        connectedServiceId: serviceConnectionId,
      };
    } else if (isBitbucket) {
      repository = {
        id: repoName,           // Bitbucket: "workspace/repo-slug"
        name: repoName,
        type: "bitbucket",
        connectedServiceId: serviceConnectionId,
      };
    } else {
      repository = {
        id: repoId,
        name: repoName,
        type: "azureReposGit",
      };
    }

    const body = {
      name: pipelineName,
      configuration: {
        type: "yaml",
        path: yamlPath || "/azure-pipelines.yml",
        repository,
      },
    };

    const data = await azureRequest(url, "POST", body);

    res.json({
      message: "Pipeline created successfully",
      pipeline: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   7️⃣ List Pipelines
============================================================ */
app.get("/pipelines/:project", async (req, res) => {
  try {
    const { project } = req.params;

    const url = `https://dev.azure.com/${org}/${project}/_apis/pipelines?api-version=7.0`;

    const data = await azureRequest(url);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   8️⃣ Trigger Pipeline Run
============================================================ */
app.post("/deploy", async (req, res) => {
  try {
    const { project, pipelineId, parameters, variables } =
      req.body;

    const url = `https://dev.azure.com/${org}/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.0`;

    const body = {
      templateParameters: parameters || {},
      variables: variables || {},
    };

    const data = await azureRequest(url, "POST", body);

    res.json({
      message: "Pipeline triggered successfully",
      runId: data.id,
      runDetails: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   Health Check
============================================================ */
app.get("/", (req, res) => {
  res.send("🚀 Azure DevOps Automation Server Running");
});

if (process.env.VERCEL !== "1") {
  app.listen(port, () =>
    console.log(`🚀 Server running at http://localhost:${port}`)
  );
}

export default app;