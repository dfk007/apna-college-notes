require('dotenv').config();
const express = require('express');
const simpleGit = require('simple-git');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

const git = simpleGit(process.env.LOCAL_CODE_PATH);

app.post('/push-and-deploy', async (req, res) => {
  try {
    // 1. Add, commit, and push to GitHub
    await git.add('.');
    await git.commit(`Auto-commit: ${new Date().toISOString()}`);
    await git.push('origin', process.env.GITHUB_BRANCH);

    // 2. Deploy to Vercel
    const deployCmd = `vercel --token ${process.env.VERCEL_TOKEN} --prod --confirm --cwd ${process.env.LOCAL_CODE_PATH}`;
    exec(deployCmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Vercel deploy error:', stderr);
        return res.status(500).send('Push succeeded, but Vercel deploy failed.');
      }
      res.send(`Push and deploy successful!\n${stdout}`);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Push or deploy failed.');
  }
});

// Serve OpenAPI spec for Cursor auto-discovery
app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "MCP Vercel Server",
      version: "1.0.0"
    },
    paths: {
      "/push-and-deploy": {
        post: {
          summary: "Push code to GitHub and deploy to Vercel",
          responses: {
            200: {
              description: "Push and deploy successful"
            },
            500: {
              description: "Push or deploy failed"
            }
          }
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
}); 