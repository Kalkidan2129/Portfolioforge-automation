const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

let portfolioStatus = {
  step: 'Idle',
  completed: false,
  portfolioUrl: ''
};

app.get('/portfolio-status', (req, res) => {
  res.json(portfolioStatus);
});

app.post('/generate-portfolio', async (req, res) => {
  const formData = req.body;

  console.log('Portfolio Request Received:');
  console.log(formData);

  fs.writeFileSync(
    'ui-portfolio-request.json',
    JSON.stringify(formData, null, 2)
  );

  portfolioStatus = {
    step: 'Starting portfolio generation...',
    completed: false,
    portfolioUrl: ''
  };

const generator = spawn('node', ['src/index.js'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    GITHUB_USERNAME: formData.githubUsername,
    GITHUB_TOKEN: formData.githubToken,
    GITHUB_REPO_NAME: formData.repoName,
    OPENROUTER_API_KEY: formData.openRouterApiKey
  }
});

  generator.stdout.on('data', (data) => {
  const message = data.toString();

  console.log(message);

  if (message.includes('Starting browser')) {
    portfolioStatus.step = '✓ Browser launched';
  }

  if (message.includes('Loaded student profile')) {
    portfolioStatus.step = '✓ Student profile loaded';
  }

  if (message.includes('Loaded project links')) {
    portfolioStatus.step = '✓ Project links loaded';
  }

  if (message.includes('Processing project')) {
    portfolioStatus.step = '⏳ Extracting project data...';
  }

  if (message.includes('Project page loaded')) {
    portfolioStatus.step = '⏳ Reading project content...';
  }

  if (message.includes('README saved')) {
    portfolioStatus.step = '⏳ Generating portfolio content...';
  }

  if (message.includes('Main portfolio README saved')) {
    portfolioStatus.step = '⏳ Building portfolio page...';
  }

  if (message.includes('Copying generated portfolio files')) {
    portfolioStatus.step = '⏳ Publishing to GitHub...';
  }

  if (message.includes('Portfolio generated successfully')) {
    portfolioStatus.step = 'Portfolio generated successfully!';
    portfolioStatus.completed = true;
  }

  if (message.includes('View your portfolio here:')) {
    const match = message.match(/https?:\/\/\S+/);

    if (match) {
      portfolioStatus.portfolioUrl = match[0];
      portfolioStatus.step = `Portfolio completed! View it here: ${match[0]}`;
      portfolioStatus.completed = true;
    }
  }
});

  generator.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  res.json({
    success: true,
    message: 'Portfolio generation started.'
  });
});

app.listen(3001, () => {
  console.log('PortfolioForge API running on port 3001');
});