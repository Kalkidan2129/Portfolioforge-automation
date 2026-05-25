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
  .map(([, label]) => label)
  .sort((a, b) => a.length - b.length)
  .slice(0, 10);

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
  const description = project.description || '';
  const tags = project.tags || [];

  const cleanTags = [...new Set(
    tags
      .map(tag => tag.trim())
      .filter(tag => tag && !['Instructions', 'Case Study'].includes(tag))
      .map(tag => {
        if (/power\s*bi|powerbi/i.test(tag)) return 'Power BI';
        if (/python\s*-\s*pandas/i.test(tag)) return 'Pandas';
        return tag;
      })
  )];

  const toolsText = cleanTags.slice(0, 4).join(', ');

  const actionVerb =
    /dashboard|power bi|report/i.test(description + title) ? 'Built' :
    /forecast|predict|machine learning|ai/i.test(description + title) ? 'Developed' :
    /sales|revenue|performance/i.test(description + title) ? 'Analyzed' :
    'Created';

  const focus =
    title
      .replace(/\s*\([^)]*\)/g, '')
      .toLowerCase();

  return `${actionVerb} a data analytics project focused on ${focus}${toolsText ? ` using ${toolsText}` : ''} to uncover trends, support decision-making, and present business insights.`;
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

  const stepUrl = projectUrl.replace('projectinstructions', 'projectsteps');

  await page.goto(stepUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.locator('text=Step Name:').first().waitFor({ timeout: 60000 });

const stepButtons = page.locator('button[ng-click^="GetSteps"]');

const detectedSteps = [...new Set(
  (await stepButtons.allTextContents())
    .map(text => text.trim())
    .filter(text => /^\d+$/.test(text))
    .map(Number)
)].sort((a, b) => a - b);

console.log(`Detected ${detectedSteps.length} real step numbers:`, detectedSteps);

const allStepDetails = [];

for (const stepNumber of detectedSteps) {

  const stepButton = page
  .locator(`button[ng-click^="GetSteps"]`)
  .filter({ hasText: String(stepNumber) })
  .locator('visible=true')
  .first();

await stepButton.click();

  await page.waitForTimeout(2000);

  let stepContent = await page.locator('body').innerText();

stepContent = stepContent
  .replace(/Chat/g, '')
  .replace(/Contact Support/g, '')
  .replace(/Job Help/g, '')
  .replace(/^\s*\d+\s*$/gm, '')
  .replace(/< back to Network Page/g, '')
  .replace(/Tagged Projects[\s\S]*?(×|Please wait\.\.)/gi, '')
  .replace(/\d+\s+Comments[\s\S]*/gi, '')
  .replace(/\d+\s*Comments?/gi, '')
  .replace(/[a-z]{8}\n\d{4}-\d{2}-\d{2}T[\s\S]*/gi, '')
  .replace(/Add this comment/g, '')
  .replace(/sans-serif/gi, '')
  .replace(/Please wait\.\./gi, '')
  .replace(/×/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

  allStepDetails.push({
    stepNumber,
    content: stepContent
  });

  console.log(`Extracted step ${stepNumber}`);
}

  const rawStepByStepContent = await page.locator('body').innerText();

  const stepByStepContent = rawStepByStepContent
  .replace(/Chat[\s\S]*?< back to Network Page/, '')
  .replace(/Tagged Projects[\s\S]*/i, '')
  .replace(/\d+\s+Comments[\s\S]*?Add this comment/gi, '')
  .replace(/sans-serif/gi, '')
  .replace(/×\s*Please wait\.\./i, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

  const projectData = {
    title: projectTitle,
    description,
    tags,
    imageUrl: projectImage,
    stepByStepLink,
    tasksLink,
    stepByStepContent,
    allStepDetails
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

const tagsList = generateProfessionalTools(projectData)
  .map(tool => `- ${tool}`)
  .join('\n');

  function detectProjectCategory(project) {
  const text = `${project.title || ''} ${project.description || ''} ${(project.tags || []).join(' ')}`.toLowerCase();

  if (/vodafone|telecom|telecommunications|subscriber|churn|network|arpu/.test(text)) {
    return 'telecom';
  }

  if (/walmart|retail|store|sales|inventory/.test(text)) {
    return 'retail';
  }

  if (/finance|revenue|profit|loss|forecast|budget/.test(text)) {
    return 'finance';
  }

  if (/healthcare|patient|hospital|medical|clinical/.test(text)) {
    return 'healthcare';
  }

  if (/machine learning|classification|prediction|model|ai/.test(text)) {
    return 'machine_learning';
  }

  if (/sql|database|etl|warehouse|pipeline/.test(text)) {
    return 'data_engineering';
  }

  if (/power bi|dashboard|visualization|dax|reporting/.test(text)) {
    return 'business_intelligence';
  }

  return 'general_analytics';
}

  function generateProfessionalInsights(project) {
  const title = (project.title || '').toLowerCase();
  const description = (project.description || '').toLowerCase();
  const tags = (project.tags || []).join(' ').toLowerCase();

  const text = `${title} ${description} ${tags}`;

  // Telecom / Vodafone Projects
if (/vodafone|telecom|telecommunications|revenue|churn/.test(text)) {
  return [
    'Analyzed telecom revenue, subscriber, churn, and network performance metrics.',
    'Built analytics dashboards to help stakeholders monitor KPI performance and revenue trends.',
    'Prepared and transformed project data for forecasting and business analysis workflows.',
    'Connected operational metrics to business-focused visual reporting for decision-making.'
  ];
}

  // Retail / Walmart Projects
if (/walmart|retail|sales/.test(text)) {
  return [
    'Analyzed retail sales performance across multiple stores to identify sales trends and business patterns.',
    'Built Power BI dashboard visuals to compare yearly sales, store activity, and operational performance.',
    'Used Power BI modeling concepts such as date tables, relationships, conditional columns, and DAX measures.',
    'Converted raw sales data into a structured business intelligence reporting solution.'
  ];
}

  // AI / Forecasting / ML Projects
  if (/forecast|machine learning|ai/.test(text)) {
    return [
      'Prepared project data for forecasting and machine learning analysis workflows.',
      'Identified patterns and trends that support predictive analytics and business planning.',
      'Structured project outputs into clear analytics deliverables and reporting assets.',
      'Presented findings in a recruiter-friendly portfolio format.'
    ];
  }

  // Default Fallback
  return [
    'Analyzed project data to identify meaningful business and operational patterns.',
    'Built structured analytics outputs to communicate findings clearly.',
    'Transformed raw project work into a professional portfolio-ready case study.',
    'Presented project results using business-focused reporting and visualization techniques.'
  ];
}

function generateProjectSummaryText(project) {
  const title = (project.title || '').toLowerCase();
  const description = project.description || '';
  const tags = (project.tags || []).join(' ').toLowerCase();
  const text = `${title} ${description} ${tags}`;

  if (/vodafone|telecom|telecommunications/.test(text)) {
    return 'This project analyzes Vodafone Qatar performance data to support revenue forecasting, churn analysis, KPI monitoring, and business reporting.';
  }

  if (/walmart|retail/.test(text)) {
    return 'This project analyzes Walmart store sales data using Power BI to identify sales trends, compare store performance, and support retail decision-making.';
  }

  return description || 'This project transforms raw project data into a structured analytics case study with clear insights, visuals, and business value.';
}

function generateBusinessProblem(project) {
  const title = (project.title || '').toLowerCase();
  const description = project.description || '';
  const tags = (project.tags || []).join(' ').toLowerCase();
  const text = `${title} ${description} ${tags}`;

  if (/vodafone|telecom|telecommunications/.test(text)) {
    return 'Telecom leaders need reliable visibility into revenue trends, churn behavior, subscriber activity, and network performance so they can make better forecasting and strategy decisions.';
  }

  if (/walmart|retail/.test(text)) {
    return 'Retail teams need to understand sales trends, seasonal patterns, and store-level performance so they can improve planning, operations, and business decision-making.';
  }

  return 'Organizations need clear analytics outputs that transform raw project data into actionable insights for better decision-making.';
}

function generateProjectObjectives(project) {
  const text = `${project.title || ''} ${project.description || ''} ${(project.tags || []).join(' ')}`.toLowerCase();

  if (/vodafone|telecom|telecommunications/.test(text)) {
    return [
      'Analyze telecom revenue, churn, subscriber, and network performance trends.',
      'Prepare data for forecasting and KPI-based business analysis.',
      'Create a clear analytics story for finance and strategy decision-making.'
    ];
  }

  if (/walmart|retail/.test(text)) {
    return [
      'Analyze Walmart sales performance across stores and time periods.',
      'Build Power BI reporting views for sales trends and store-level comparison.',
      'Use data modeling and DAX measures to support retail performance analysis.'
    ];
  }

  return [
    'Analyze project data to identify meaningful patterns.',
    'Create a structured analytics deliverable for business users.',
    'Present results in a recruiter-friendly portfolio format.'
  ];
}

function generateBusinessImpact(project) {
  const text = `${project.title || ''} ${project.description || ''} ${(project.tags || []).join(' ')}`.toLowerCase();

  if (/vodafone|telecom|telecommunications/.test(text)) {
    return [
      'Improves visibility into telecom revenue, churn, and subscriber performance.',
      'Supports forecasting and strategic planning for finance and leadership teams.',
      'Helps decision-makers monitor business health through KPI-focused reporting.'
    ];
  }

  if (/walmart|retail/.test(text)) {
    return [
      'Helps retail teams compare store performance and identify sales trends.',
      'Supports better planning around seasonal demand and store-level operations.',
      'Turns historical sales data into a clear dashboard for business review.'
    ];
  }

  return [
    'Improves visibility into project outcomes and business patterns.',
    'Supports better decision-making through structured analysis and reporting.',
    'Turns raw project work into a clear, professional analytics case study.'
  ];
}

function generateProfessionalTools(project) {
  const category = detectProjectCategory(project);

  if (category === 'telecom') {
    return ['Power BI', 'Python', 'Pandas', 'Microsoft Fabric', 'ETL', 'Data Forecasting'];
  }

  if (category === 'retail') {
    return ['Power BI', 'Excel', 'DAX', 'Data Modeling', 'Retail Analytics'];
  }

  if (category === 'machine_learning') {
    return ['Python', 'Pandas', 'Machine Learning', 'Forecasting', 'Data Analytics'];
  }

  return [...new Set((project.tags || [])
    .map(tag => tag.trim())
    .filter(tag => tag && !['Instructions', 'Case Study'].includes(tag))
  )].slice(0, 6);
}

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
  
  const detailText = project.stepByStepContent || description;

  const problemMatch = detailText.match(
  /Detailed Instructions:\s*[\r\n\s]*Problem Statement\s*([\s\S]*?)(?:\n\s*Objective|\n\s*Insight:|$)/i
);

  const businessProblem = problemMatch
    ? problemMatch[1].trim()
    : description;

  return {
    overview: generateProjectSummaryText(project),
    businessProblem: generateBusinessProblem(project),
  keyInsights: generateProfessionalInsights(project),
  };
}

  const projectDetails = generateProjectDetails(projectData);
  const projectApproach = projectData.allStepDetails
  .map(step => {
    const match = step.content.match(/Step Name:\s*(.*)/i);
    return match ? match[1].trim() : null;
  })
  .filter(Boolean)
  .filter(stepName => !/expected final|final dashboard|deployment|case\s*\d+/i.test(stepName))
  .slice(0, 6)
  .map(stepName => `- ${stepName}`)
  .join('\n');

  const readmeContent = `
# ${projectData.title}

${projectData.imageUrl ? `![Project Preview](${projectData.imageUrl})` : ''}

## Project Summary

${projectDetails.overview}

---

## Business Problem

${projectDetails.businessProblem}

---

## Objective

${generateProjectObjectives(projectData).map(objective => `- ${objective}`).join('\n')}

---

## Tools & Technologies

${tagsList}

---

## Project Workflow

${projectApproach || '- Collected and reviewed project data.\n- Cleaned and prepared the data for analysis.\n- Built visualizations to explore trends and patterns.\n- Summarized findings into business-focused insights.'}

---

## Key Insights

${projectDetails.keyInsights.length > 0
  ? projectDetails.keyInsights.map(insight => `- ${insight}`).join('\n')
  : '- Identified important business patterns from the project data.\n- Created visual summaries to make the analysis easier to understand.\n- Organized the project into a clear portfolio-ready case study.'}

---

## Final Dashboard / Project Preview

${projectData.imageUrl ? `![Final Dashboard](${projectData.imageUrl})` : 'No project preview image available.'}

---

## Business Impact

${generateBusinessImpact(projectData).map(item => `- ${item}`).join('\n')}

---

## Files Included

- README.md
- project-data.json

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
