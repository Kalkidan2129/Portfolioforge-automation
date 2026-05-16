const readline = require('readline');
const { chromium } = require('playwright');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
}

async function testBrowser() {
  const projectUrl = 'https://app.colaberry.com/app/network/network/1659/projectinstructions';
  
  console.log("Starting browser test...");
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app.colaberry.com');
  
  // Wait for login success (URL changes to dashboard or other authenticated page)
  await page.waitForURL(/\/(dashboard|home|app|profile|portal).*/i, { timeout: 0 });
  
  console.log("Login completed successfully");
  
  // Navigate to project page
  await page.goto(projectUrl);
  await page.waitForLoadState('load');
  console.log("Project page loaded");
  
  // Extract project data
  const projectTitle = await page.locator('h1.ng-binding').first().textContent();
  const description = await page.locator('p.ng-binding').first().textContent();
  const tags = (await page.locator('a.tagstyle.ng-binding').allTextContents())
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // Extract additional project elements
  const projectImage = await page.locator('div.col-sm-6.hidden-xs img').first().getAttribute('src');
  const stepByStepLink = await page.locator('a:has-text("Step By Step")').first().getAttribute('href');
  const tasksLink = await page.locator('a.btn.btn-primary').first().getAttribute('href');
  
  console.log('\n--- Extracted Project Data ---');
  console.log('Title:', projectTitle);
  console.log('Description:', description);
  console.log('Tags:', tags.length > 0 ? tags.join(', ') : 'None');
  console.log('Project Image:', projectImage);
  console.log('Step By Step Link:', stepByStepLink);
  console.log('Tasks Link:', tasksLink);
  
  await page.waitForTimeout(300000);
  await browser.close();
  console.log("Browser test complete.");
}

testBrowser();
