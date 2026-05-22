const fs = require('fs');
const readline = require('readline');
const { chromium } = require('playwright');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const allProjectsData = [];
const links = [];
const MAX_LINKS = 3;
const MIN_LINKS = 1;

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isDuplicate(url) {
  return links.includes(url);
}

function promptForLink() {
  return new Promise((resolve) => {
    const prompt = links.length === 0 
      ? `Enter project link 1 of ${MAX_LINKS} (press Enter to stop, minimum ${MIN_LINKS} required): `
      : `Enter project link ${links.length + 1} of ${MAX_LINKS} (press Enter to stop): `;
    
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function run() {
  console.log("PortfolioForge AI started\n");
  
  while (links.length < MAX_LINKS) {
    const input = await promptForLink();
    
    if (input === '') {
      if (links.length >= MIN_LINKS) {
        console.log("\nInput complete.");
        break;
      } else {
        console.log(`Please enter at least ${MIN_LINKS} link(s).`);
        continue;
      }
    }
    
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      console.log("Invalid: URL must start with http:// or https://");
      continue;
    }
    
    if (!isValidUrl(input)) {
      console.log("Invalid: please enter a valid URL");
      continue;
    }
    
    if (isDuplicate(input)) {
      console.log("Invalid: duplicate link, please enter a unique URL");
      continue;
    }
    
    links.push(input);
    console.log(`Added: ${input}`);
  }
  
  if (links.length === MAX_LINKS) {
    console.log("\nMaximum links reached.");
  }
  
  console.log("\nAccepted links:");
  links.forEach((link, index) => {
    console.log(`  ${index + 1}. ${link}`);
  });
  
  rl.close();
  
  // Run browser test for each validated project link
  if (links.length > 0) {
    await processProjects(links);
  }
}

async function processProjects(projectLinks) {
  console.log("Starting browser...");
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://app.colaberry.com');

  await page.waitForURL(/\/(dashboard|home|app|profile|portal).*/i, { timeout: 0 });

  console.log("Login completed successfully");

  for (let index = 0; index < projectLinks.length; index++) {
    await processSingleProject(page, projectLinks[index], index + 1);
  }

  const normalizeSkillKey = (skill) => {
  return skill
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

  const formatSkillLabel = (skill) => {
  return skill
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/python\s*-\s*pandas/i, 'Pandas')
    .replace(/powerbi/i, 'Power BI');
};

  const skillMap = new Map();

allProjectsData
  .flatMap(project => project.tags || [])
  .forEach(skill => {
    const label = formatSkillLabel(skill);
    const key = normalizeSkillKey(label);

    if (!skillMap.has(key)) {
      skillMap.set(key, label);
    }
  });

const excludedSkillKeys = new Set([
  'instructions',
  'casestudy'
]);

const skills = [...skillMap.entries()]
  .filter(([key]) => !excludedSkillKeys.has(key))
  .map(([, label]) => label);

const colors = [
  'F2C811',
  '025E8C',
  '3776AB',
  '217346',
  'FF7A00',
  '00A6A6',
  '6A5ACD',
  'D83B01'
];

const skillsBadges = skills.map((skill, index) => {
  const color = colors[index % colors.length];

  return `<img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-${color}?style=for-the-badge&logoColor=white" alt="${skill}">`;
}).join(' ');

function generateProjectSummary(project) {
  const title = project.title || 'data analytics project';

  const tools = (project.tags || [])
    .filter(tag =>
      ['Power BI', 'Python', 'Excel', 'SQL', 'ETL', 'Machine Learning', 'Pandas']
      .includes(tag)
    )
    .slice(0, 4);

  const toolsText = tools.length > 0
    ? ` using ${tools.join(', ')}`
    : '';

  return `This project focuses on ${title.toLowerCase()}${toolsText} to deliver business insights and analytics solutions.`;
}

function generatePortfolioAbout(projects) {
  const projectCount = projects.length;

  const allTags = [...new Set(
    projects.flatMap(project => project.tags || [])
  )];

  const focusKeywords = [];

if (allTags.some(tag => /forecast/i.test(tag))) {
  focusKeywords.push('forecasting');
}

if (allTags.some(tag => /telecommunications/i.test(tag))) {
  focusKeywords.push('telecommunications');
}

if (allTags.some(tag => /retail/i.test(tag))) {
  focusKeywords.push('retail intelligence');
}

if (allTags.some(tag => /machine learning|ai/i.test(tag))) {
  focusKeywords.push('machine learning');
}

if (allTags.some(tag => /finance/i.test(tag))) {
  focusKeywords.push('business performance analysis');
}

const focusAreas = focusKeywords.join(', ');

  return `This portfolio highlights ${projectCount} data analytics and business intelligence project${projectCount > 1 ? 's' : ''}, focusing on ${focusAreas}. It demonstrates practical experience in transforming project work into clear, structured, and recruiter-friendly analytics stories.`;
}

function generatePortfolioTitle(projects) {
  const allTags = projects.flatMap(project => project.tags || []);

  if (allTags.some(tag => /machine learning|ai/i.test(tag))) {
    return 'AI & Data Analytics Portfolio';
  }

  if (allTags.some(tag => /finance/i.test(tag))) {
    return 'Finance & Data Analytics Portfolio';
  }

  if (allTags.some(tag => /retail/i.test(tag))) {
    return 'Retail & Business Intelligence Portfolio';
  }

  return 'Data Analytics Portfolio';
}

  const mainReadmeContent = `# ${generatePortfolioTitle(allProjectsData)}

## Skills & Tools

${skillsBadges}

---

## About

${generatePortfolioAbout(allProjectsData)}

---

## Projects

${allProjectsData.map((project, index) => `
<table>
<tr>
<td width="40%">

<img src="${project.imageUrl || ''}" width="100%">

</td>

<td width="60%">

## ${index + 1}. ${project.title}

${generateProjectSummary(project)}

<br><br>

<a href="./project-${index + 1}/README.md">View Full Project →</a>

</td>
</tr>
</table>

<br>
`).join('\n')}
`;

  fs.writeFileSync('generated-portfolio/README.md', mainReadmeContent);
  console.log('Main portfolio README saved to generated-portfolio/README.md');

  await page.waitForTimeout(300000);
  await browser.close();
  console.log("Browser workflow complete.");
}

async function processSingleProject(page, projectUrl, projectNumber) {
  const outputFolder = `generated-portfolio/project-${projectNumber}`;

  console.log(`\nProcessing project ${projectNumber}...`);

  await page.goto(projectUrl);
  await page.waitForLoadState('load');
  console.log("Project page loaded");

  const projectTitle = (await page.locator('h1.ng-binding').first().textContent()) || 'Untitled Project';
  const description = (await page.locator('p.ng-binding').first().textContent()) || '';
  const tags = (await page.locator('a.tagstyle.ng-binding').allTextContents())
    .map(tag => tag.trim())
    .filter(tag => tag !== '');

  const projectImage = (await page.locator('div.col-sm-6.hidden-xs img').first().getAttribute('src')) || '';
  const stepByStepLink = (await page.locator('a:has-text("Step By Step")').first().getAttribute('href')) || '';
  const tasksLink = (await page.locator('a.btn.btn-primary').first().getAttribute('href')) || '';

  const projectData = {
    title: projectTitle,
    description,
    tags,
    imageUrl: projectImage,
    stepByStepLink,
    tasksLink
  };
  allProjectsData.push(projectData);
  console.log('\n--- Extracted Project Data ---');
  console.log(JSON.stringify(projectData, null, 2));

  const excludedTags = ['Instructions', 'Case Study'];

const normalizedTags = [...new Set(
  projectData.tags
    .map(tag => tag.trim())
    .filter(tag => tag && !excludedTags.includes(tag))
    .map(tag => {
      if (/power\s*bi/i.test(tag)) return 'Power BI';
      if (/python\s*-\s*pandas/i.test(tag)) return 'Pandas';
      return tag;
    })
)];

const tagsList = normalizedTags.length > 0
  ? normalizedTags.map(tag => `- ${tag}`).join('\n')
  : 'No tags available';

function generateProjectDetails(project) {
  const title = project.title || 'Untitled Project';
  const description = project.description || 'No project description available.';
  const tags = project.tags || [];

  const excludedTags = ['Instructions', 'Case Study'];

const cleanTags = [...new Set(
  tags
    .map(tag => tag.trim())
    .filter(tag => tag && !excludedTags.includes(tag))
)];

  const toolsText = cleanTags
   .slice(0, 5)
   .join(', ') || 'data analytics tools';

  return {
    overview: description,
    businessProblem: `This project uses available project information to explore ${title.toLowerCase()}, identify important patterns, and communicate business insights using ${toolsText}.`,
    keyInsights: [
      `Explored project context related to ${title.toLowerCase()}`,
      `Used ${toolsText} to support analysis and reporting`,
      `Transformed project information into a structured portfolio-ready case study`
    ]
  };
}

  const projectDetails = generateProjectDetails(projectData);
  const readmeContent = `
# ${projectData.title}

## Project Overview

${projectDetails.overview}

---

## Business Problem

${projectDetails.businessProblem}

---

## Tools & Technologies

${tagsList}

---

## Key Insights

${projectDetails.keyInsights.map(insight => `- ${insight}`).join('\n')}

---

## Project Preview

${projectData.imageUrl ? `![Project Preview](${projectData.imageUrl})` : 'No image available.'}

---

## Additional Resources

${projectData.stepByStepLink ? `- [Step-by-Step Instructions](${projectData.stepByStepLink})` : ''}

${projectData.tasksLink ? `- [Project Tasks Board](${projectData.tasksLink})` : ''}

---

## Portfolio Navigation

[← Back to Portfolio Home](../README.md)
`;

  fs.mkdirSync(outputFolder, { recursive: true });
  fs.writeFileSync(`${outputFolder}/README.md`, readmeContent);
  fs.writeFileSync(`${outputFolder}/project-data.json`, JSON.stringify(projectData, null, 2));

  console.log(`README saved to ${outputFolder}/README.md`);
  console.log(`Project data saved to ${outputFolder}/project-data.json`);
}
run();
