# MCP Vercel Server

## Overview
This MCP server automates the process of pushing code from a local directory to a GitHub repository and then deploying it to a specified Vercel domain. It is designed to integrate seamlessly with Cursor IDE, allowing you to trigger deployments with a single click or via MCP Tools.

---

## Features
- Pushes code from your local directory to the `main` branch of a specified GitHub repository.
- Deploys the latest code to a specified Vercel project/domain after each push.
- Exposes a `/push-and-deploy` HTTP endpoint for easy integration.
- Provides an OpenAPI spec at `/openapi.json` for auto-discovery in Cursor IDE.

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- Vercel CLI installed globally (`npm install -g vercel`)
- GitHub repository (with write access and authentication set up)
- Vercel account and project

### 2. Clone or Copy the MCP Server
Place the `mcp-vercel` folder in your desired location.

### 3. Configure Environment Variables
Edit the `.env` file in `mcp-vercel`:

```
GITHUB_REPO_URL=git@github.com:yourusername/yourrepo.git
GITHUB_BRANCH=main
LOCAL_CODE_PATH=/absolute/path/to/your/code
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT=your-vercel-project-name
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_DOMAIN=yourdomain.vercel.app
```

- Replace values with your actual GitHub and Vercel details.

### 4. Install Dependencies
```
cd mcp-vercel
npm install
```

### 5. Start the MCP Server
```
npm start
```
The server will run at `http://localhost:3000` by default.

---

## Using with Cursor IDE

### 1. Add the MCP Server to Cursor
- Go to **MCP Tools** in Cursor IDE.
- Click **New MCP Server**.
- Name: `Local MCP Vercel`
- URL: `http://localhost:3000`
- Description: (optional)
- Save.

### 2. Auto-Discovery of Actions
- The server exposes an OpenAPI spec at `/openapi.json`.
- Cursor will auto-detect the `/push-and-deploy` action and show it in the MCP Tools panel.

### 3. Triggering a Deploy
- You can trigger the deploy by selecting the action in MCP Tools, or by using a `.http` file:

  Create `deploy.http`:
  ```http
  POST http://localhost:3000/push-and-deploy
  ```
  Open in Cursor and click "Send Request".

---

## What Happens When Triggered?
1. The server stages, commits, and pushes all changes from your local directory to the `main` branch of your GitHub repo.
2. After a successful push, it runs a Vercel deployment for your project using the Vercel CLI and your token.
3. The endpoint responds with the result of the deployment.

---

## How to Verify It Is Working

1. **Check the Response:**
   - A successful response will say `Push and deploy successful!` and include Vercel output.
   - Errors will be reported in the response.

2. **Check GitHub:**
   - Visit your GitHub repository and verify that a new commit has appeared on the `main` branch.

3. **Check Vercel:**
   - Visit your Vercel dashboard or the specified domain (e.g., `https://yourdomain.vercel.app`) to see the deployed changes.

4. **Cursor IDE:**
   - The MCP action should appear in the MCP Tools panel.
   - Triggering the action should result in a deployment as described above.

---

## Troubleshooting
- Ensure all environment variables are set correctly in `.env`.
- Make sure your local directory is a valid Git repository and has the correct remote set.
- Ensure your Vercel token and project details are correct.
- Check server logs for errors.

---

## License
MIT 