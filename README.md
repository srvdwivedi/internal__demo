# Internal Deployment Platform - v1.0.0

Production-ready scalable POC using:

- Azure DevOps (Single Master Pipeline)
- Vercel Deployment API
- Internal Admin UI
- Backend Deployment Service

---

## Architecture

Admin UI → Backend API → Azure DevOps → Vercel → Public URL

---

## Setup Guide

### 1️⃣ Backend Setup
cd backend
npm install
node server.js

Update backend/.env with:

AZURE_ORG=your-org
AZURE_PROJECT=your-project
PIPELINE_ID=your-pipeline-id
AZURE_PAT=your-azure-pat

---

### 2️⃣ Frontend Setup
cd frontend
npm install
npm start

---

### 3️⃣ Azure DevOps Setup

1. Push this repo to Azure DevOps
2. Create pipeline using: pipeline/azure-pipelines.yml
3. Add secret variable:
   VERCEL_TOKEN

---

### 4️⃣ Vercel Setup

1. Create Vercel Personal Token
2. Add it as VERCEL_TOKEN in Azure DevOps

---

After deployment:

https://<projectName>.vercel.app

---

Generated on: 2026-03-02T11:27:45.724044 UTC
# internal__demo
