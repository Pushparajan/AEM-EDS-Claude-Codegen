#!/usr/bin/env node

/**
 * AEM Edge Delivery Services Code Generator
 * Generates blocks, components, and boilerplate code for AEM EDS projects
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { coreComponents, componentCategories } = require('./core-components');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Template generators
const templates = {
  block: (name, options = {}) => {
    const className = name.toLowerCase().replace(/\s+/g, '-');
    const jsContent = `export default function decorate(block) {
  // TODO: Implement ${name} block decoration logic
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    // Process cells and create block structure
    console.log('Processing row:', row);
  });

  ${options.hasButtons ? `// Add button functionality
  const buttons = block.querySelectorAll('a.button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Handle button click
    });
  });` : ''}

  ${options.lazyLoad ? `// Implement lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load content
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(block);` : ''}
}
`;

    const cssContent = `.${className} {
  /* Container styles */
  display: block;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

.${className} > div {
  /* Row styles */
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.${className} > div > div {
  /* Cell styles */
  flex: 1;
}

${options.hasButtons ? `
.${className} a.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.${className} a.button:hover {
  background-color: #0052a3;
}` : ''}

${options.responsive ? `
@media (max-width: 768px) {
  .${className} > div {
    flex-direction: column;
  }
}` : ''}
`;

    return { js: jsContent, css: cssContent, className };
  },

  component: (name, type = 'functional') => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);

    if (type === 'class') {
      return `export default class ${componentName} {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Initialize component
    console.log('${componentName} initialized');
  }

  render() {
    // Render component
  }

  destroy() {
    // Cleanup
  }
}
`;
    }

    return `export default function ${componentName}(element, options = {}) {
  // Component logic
  const defaults = {
    // Default options
  };

  const config = { ...defaults, ...options };

  function init() {
    // Initialize component
    console.log('${componentName} initialized with config:', config);
  }

  function render() {
    // Render logic
  }

  // Public API
  return {
    init,
    render,
    element
  };
}
`;
  },

  template: (name) => {
    const templateName = name.toLowerCase().replace(/\s+/g, '-');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link rel="stylesheet" href="/styles/styles.css">
  <script type="module" src="/scripts/scripts.js"></script>
</head>
<body>
  <header></header>
  <main>
    <div class="${templateName}">
      <!-- Template content -->
    </div>
  </main>
  <footer></footer>
</body>
</html>
`;
  }
};

// Generator functions
async function generateBlock() {
  console.log('\n=== Block Generator ===\n');

  const name = await question('Block name: ');
  if (!name) {
    console.log('Block name is required');
    return;
  }

  const hasButtons = (await question('Include button support? (y/n): ')).toLowerCase() === 'y';
  const lazyLoad = (await question('Enable lazy loading? (y/n): ')).toLowerCase() === 'y';
  const responsive = (await question('Add responsive styles? (y/n): ')).toLowerCase() === 'y';

  const options = { hasButtons, lazyLoad, responsive };
  const { js, css, className } = templates.block(name, options);

  const blocksDir = path.join(process.cwd(), 'blocks', className);

  if (!fs.existsSync(blocksDir)) {
    fs.mkdirSync(blocksDir, { recursive: true });
  }

  fs.writeFileSync(path.join(blocksDir, `${className}.js`), js);
  fs.writeFileSync(path.join(blocksDir, `${className}.css`), css);

  console.log(`\n✓ Block "${name}" created successfully!`);
  console.log(`  Location: blocks/${className}/`);
  console.log(`  Files: ${className}.js, ${className}.css`);
}

async function generateComponent() {
  console.log('\n=== Component Generator ===\n');

  const name = await question('Component name: ');
  if (!name) {
    console.log('Component name is required');
    return;
  }

  const type = (await question('Type (functional/class) [functional]: ')) || 'functional';

  const content = templates.component(name, type);
  const componentsDir = path.join(process.cwd(), 'components');

  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  const fileName = `${name.toLowerCase()}.js`;
  fs.writeFileSync(path.join(componentsDir, fileName), content);

  console.log(`\n✓ Component "${name}" created successfully!`);
  console.log(`  Location: components/${fileName}`);
}

async function generateTemplate() {
  console.log('\n=== Template Generator ===\n');

  const name = await question('Template name: ');
  if (!name) {
    console.log('Template name is required');
    return;
  }

  const content = templates.template(name);
  const templatesDir = path.join(process.cwd(), 'templates');

  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.html`;
  fs.writeFileSync(path.join(templatesDir, fileName), content);

  console.log(`\n✓ Template "${name}" created successfully!`);
  console.log(`  Location: templates/${fileName}`);
}

async function initProject() {
  console.log('\n=== Initialize AEM EDS Project ===\n');

  const projectName = await question('Project name: ');
  if (!projectName) {
    console.log('Project name is required');
    return;
  }

  const projectDir = path.join(process.cwd(), projectName);

  // Create directory structure
  const dirs = [
    'blocks',
    'components',
    'templates',
    'scripts',
    'styles',
    'icons',
    'test'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(projectDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Create basic files
  const scriptsJs = `// Import all blocks
function loadBlocks() {
  document.querySelectorAll('[class*="block"]').forEach(async (block) => {
    const classes = block.className.split(' ');
    const blockName = classes.find(c => c !== 'block');

    if (blockName) {
      try {
        const module = await import(\`../blocks/\${blockName}/\${blockName}.js\`);
        if (module.default) {
          module.default(block);
        }
      } catch (error) {
        console.error(\`Failed to load block: \${blockName}\`, error);
      }
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
  loadBlocks();
}
`;

  const stylesCss = `/* AEM EDS Project Styles */

:root {
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

main {
  min-height: 100vh;
}

.section {
  padding: 40px 20px;
}

.button-container {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}
`;

  fs.writeFileSync(path.join(projectDir, 'scripts', 'scripts.js'), scriptsJs);
  fs.writeFileSync(path.join(projectDir, 'styles', 'styles.css'), stylesCss);

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: 'AEM Edge Delivery Services Project',
    type: 'module',
    scripts: {
      test: 'echo "No tests specified"',
      lint: 'eslint .',
      dev: 'echo "Start your local development server"'
    },
    keywords: ['aem', 'eds', 'edge-delivery'],
    author: '',
    license: 'MIT'
  };

  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log(`\n✓ Project "${projectName}" initialized successfully!`);
  console.log(`  Location: ${projectName}/`);
  console.log('  Structure created with directories: ' + dirs.join(', '));
}

async function generateCoreComponent() {
  console.log('\n=== Core Component Library ===\n');
  console.log('Available component categories:\n');

  const categories = Object.keys(componentCategories);
  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.charAt(0).toUpperCase() + cat.slice(1)} Components`);
  });

  console.log('');
  const categoryChoice = await question(`Select category (1-${categories.length}): `);
  const categoryIndex = parseInt(categoryChoice) - 1;

  if (categoryIndex < 0 || categoryIndex >= categories.length) {
    console.log('Invalid category selection');
    return;
  }

  const selectedCategory = categories[categoryIndex];
  const components = componentCategories[selectedCategory];

  console.log(`\n${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Components:\n`);

  components.forEach((comp, index) => {
    const component = coreComponents[comp];
    console.log(`${index + 1}. ${comp.charAt(0).toUpperCase() + comp.slice(1)} - ${component.description}`);
  });

  console.log('');
  const componentChoice = await question(`Select component (1-${components.length}): `);
  const componentIndex = parseInt(componentChoice) - 1;

  if (componentIndex < 0 || componentIndex >= components.length) {
    console.log('Invalid component selection');
    return;
  }

  const selectedComponentName = components[componentIndex];
  const selectedComponent = coreComponents[selectedComponentName];
  const className = selectedComponentName.toLowerCase().replace(/\s+/g, '-');

  // Generate the component
  const blocksDir = path.join(process.cwd(), 'blocks', className);

  if (!fs.existsSync(blocksDir)) {
    fs.mkdirSync(blocksDir, { recursive: true });
  }

  fs.writeFileSync(path.join(blocksDir, `${className}.js`), selectedComponent.js);
  fs.writeFileSync(path.join(blocksDir, `${className}.css`), selectedComponent.css);

  console.log(`\n✓ Core component "${selectedComponentName}" created successfully!`);
  console.log(`  Category: ${selectedCategory}`);
  console.log(`  Location: blocks/${className}/`);
  console.log(`  Files: ${className}.js, ${className}.css`);
  console.log(`  Description: ${selectedComponent.description}`);
}

// Main menu
async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  AEM EDS Code Generator                   ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('What would you like to generate?\n');
  console.log('1. Custom Block');
  console.log('2. Custom Component');
  console.log('3. Template');
  console.log('4. Core Component (from library)');
  console.log('5. Initialize new project');
  console.log('6. Exit\n');

  const choice = await question('Enter your choice (1-6): ');

  switch (choice) {
    case '1':
      await generateBlock();
      break;
    case '2':
      await generateComponent();
      break;
    case '3':
      await generateTemplate();
      break;
    case '4':
      await generateCoreComponent();
      break;
    case '5':
      await initProject();
      break;
    case '6':
      console.log('Goodbye!');
      rl.close();
      return;
    default:
      console.log('Invalid choice');
  }

  console.log('\n');
  const continueGen = await question('Generate another? (y/n): ');

  if (continueGen.toLowerCase() === 'y') {
    await main();
  } else {
    console.log('Goodbye!');
    rl.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { templates, generateBlock, generateComponent, generateTemplate, initProject, generateCoreComponent, coreComponents };
