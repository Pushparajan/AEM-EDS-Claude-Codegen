#!/usr/bin/env node

/**
 * AEM Edge Delivery Services Code Generator
 * Generates blocks, components, and boilerplate code for AEM EDS projects
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { coreComponents, componentCategories } = require('./core-components');
const { analyzeImage, generateFromImageWithAI, analysisPrompts } = require('./image-analyzer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Template generators
const templates = {
  block: (name, options = {}) => {
    const className = name.toLowerCase().replace(/\s+/g, '-');

    // Universal Editor instrumentation helper
    const universalEditorHelper = options.universalEditor !== false ? `
/**
 * Moves Universal Editor instrumentation attributes from source to target element.
 * This preserves in-context editing capabilities when restructuring the DOM.
 * @param {Element} source - Original element with data-aue-* attributes
 * @param {Element} target - New element to receive the attributes
 */
function moveInstrumentation(source, target) {
  if (source === target) return;

  // AEM Universal Editor instrumentation attributes
  const instrumentationAttrs = [
    'data-aue-resource',  // URN to the content resource
    'data-aue-type',      // Type: component, container, text, richtext, reference
    'data-aue-prop',      // Property name for the field
    'data-aue-label',     // Custom label for the field
    'data-aue-filter',    // Component filter (e.g., 'cf' for content fragments)
    'data-aue-behavior',  // Behavior: 'component' for move/delete capabilities
  ];

  instrumentationAttrs.forEach((attr) => {
    const value = source.getAttribute(attr);
    if (value) {
      target.setAttribute(attr, value);
      source.removeAttribute(attr);
    }
  });
}
` : '';

    const jsContent = `${universalEditorHelper}export default function decorate(block) {
  // TODO: Implement ${name} block decoration logic
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];

    // Process cells and create block structure${options.universalEditor !== false ? `
    // IMPORTANT: When restructuring DOM, preserve Universal Editor instrumentation
    // Example:
    // const newElement = document.createElement('div');
    // moveInstrumentation(cells[0], newElement);
    // row.appendChild(newElement);` : ''}

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
  },

  /**
   * Generates a component model definition for AEM Universal Editor.
   * Component models define the fields shown in the Universal Editor properties panel.
   * @param {string} blockName - Name of the block
   * @param {Array} fields - Array of field definitions
   * @returns {object} Component model definition
   */
  componentModel: (blockName, fields = []) => {
    const blockId = blockName.toLowerCase().replace(/\s+/g, '-');

    // Default fields if none provided
    const defaultFields = fields.length > 0 ? fields : [
      {
        component: 'text',
        name: 'title',
        label: 'Title',
        valueType: 'string'
      },
      {
        component: 'richtext',
        name: 'description',
        label: 'Description',
        valueType: 'string'
      }
    ];

    return {
      id: blockId,
      fields: defaultFields,
      filter: {
        // Filter defines which blocks this model applies to
        'name': blockId
      }
    };
  },

  /**
   * Generates a complete component-models.json file for a project.
   * This file is required for Universal Editor integration.
   * @param {Array} models - Array of component model objects
   * @returns {string} JSON string of component models
   */
  componentModelsFile: (models = []) => {
    const defaultModels = models.length > 0 ? models : [
      {
        id: 'example',
        fields: [
          {
            component: 'text',
            name: 'title',
            label: 'Title',
            valueType: 'string'
          }
        ]
      }
    ];

    return JSON.stringify({
      ':type': 'sheet',
      'data': defaultModels
    }, null, 2);
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

async function generateFromImage() {
  console.log('\n=== Generate Component from Image ===\n');
  console.log('This feature analyzes UI screenshots/designs and generates component code.\n');

  const imagePath = await question('Image path (PNG, JPG, WebP, etc.): ');

  if (!imagePath) {
    console.log('Image path is required');
    return;
  }

  try {
    // Validate image
    const imageInfo = analyzeImage(imagePath);
    console.log(`\n✓ Image found: ${path.basename(imagePath)} (${(imageInfo.size / 1024).toFixed(2)} KB)`);
  } catch (error) {
    console.log(`\n✗ Error: ${error.message}`);
    return;
  }

  const componentName = await question('\nComponent name: ');
  if (!componentName) {
    console.log('Component name is required');
    return;
  }

  console.log('\n=== Image Analysis Mode ===\n');
  console.log('Choose how to analyze the image:\n');
  console.log('1. Interactive description (recommended)');
  console.log('2. Auto-generate template (basic structure)');
  console.log('3. Import analysis from JSON file\n');

  const mode = await question('Select mode (1-3): ');

  let analysis = {};

  switch (mode) {
    case '1':
      analysis = await interactiveAnalysis();
      break;
    case '2':
      analysis = generateBasicAnalysis();
      break;
    case '3':
      analysis = await importAnalysisFromFile();
      break;
    default:
      console.log('Invalid mode selected');
      return;
  }

  // Generate component from analysis
  console.log('\nGenerating component...');

  const component = generateFromImageWithAI(
    { path: imagePath },
    componentName,
    analysis
  );

  // Save component files
  const blocksDir = path.join(process.cwd(), 'blocks', component.className);

  if (!fs.existsSync(blocksDir)) {
    fs.mkdirSync(blocksDir, { recursive: true });
  }

  // Save HTML template (as a reference/documentation file)
  fs.writeFileSync(path.join(blocksDir, `${component.className}.html`), component.html);
  fs.writeFileSync(path.join(blocksDir, `${component.className}.js`), component.js);
  fs.writeFileSync(path.join(blocksDir, `${component.className}.css`), component.css);

  // Save analysis for reference
  fs.writeFileSync(
    path.join(blocksDir, 'analysis.json'),
    JSON.stringify(analysis, null, 2)
  );

  console.log(`\n✓ Component "${componentName}" created from image!`);
  console.log(`  Location: blocks/${component.className}/`);
  console.log(`  Files:`);
  console.log(`    - ${component.className}.html (reference structure)`);
  console.log(`    - ${component.className}.js`);
  console.log(`    - ${component.className}.css`);
  console.log(`    - analysis.json (for future reference)`);
  console.log(`\n💡 Tip: Review and customize the generated code to match your exact design.`);
}

async function interactiveAnalysis() {
  console.log('\n=== Interactive Image Analysis ===\n');
  console.log('Please describe what you see in the image:\n');

  const analysis = {
    layout: {},
    colors: {},
    typography: {},
    components: [],
    interactions: []
  };

  // Layout questions
  console.log('--- Layout ---');
  const layoutType = await question('Layout type (grid/flex/block) [flex]: ') || 'flex';
  analysis.layout.type = layoutType;

  if (layoutType === 'grid') {
    const cols = await question('Number of columns [auto-fit]: ') || 'repeat(auto-fit, minmax(300px, 1fr))';
    analysis.layout.columns = cols;
  } else if (layoutType === 'flex') {
    const direction = await question('Flex direction (row/column) [row]: ') || 'row';
    analysis.layout.direction = direction;
  }

  const gap = await question('Gap/spacing between elements [20px]: ') || '20px';
  analysis.layout.gap = gap;

  const hasHeader = (await question('Has header section? (y/n): ')).toLowerCase() === 'y';
  const hasFooter = (await question('Has footer section? (y/n): ')).toLowerCase() === 'y';
  analysis.layout.hasHeader = hasHeader;
  analysis.layout.hasFooter = hasFooter;

  // Color questions
  console.log('\n--- Colors ---');
  const primaryColor = await question('Primary color [#0066cc]: ') || '#0066cc';
  const bgColor = await question('Background color [#ffffff]: ') || '#ffffff';
  const textColor = await question('Text color [#333333]: ') || '#333333';

  analysis.colors = {
    primary: primaryColor,
    background: bgColor,
    text: textColor
  };

  // Typography
  console.log('\n--- Typography ---');
  const fontFamily = await question('Font family [system-ui, sans-serif]: ') || 'system-ui, sans-serif';
  const fontSize = await question('Base font size [16px]: ') || '16px';
  const lineHeight = await question('Line height [1.6]: ') || '1.6';

  analysis.typography = {
    fontFamily,
    baseFontSize: fontSize,
    lineHeight
  };

  // Components
  console.log('\n--- Components ---');
  console.log('List the UI components you see (one per line, empty line to finish):');
  console.log('Examples: button, card, navigation, image, heading, form, etc.\n');

  let componentInput;
  while (true) {
    componentInput = await question('Component type (or press Enter to finish): ');
    if (!componentInput) break;

    const description = await question('  Brief description: ');
    analysis.components.push({
      type: componentInput.toLowerCase(),
      description: description || componentInput
    });
  }

  // Interactions
  console.log('\n--- Interactions ---');
  const hasHover = (await question('Has hover effects? (y/n): ')).toLowerCase() === 'y';
  const hasClick = (await question('Has click interactions? (y/n): ')).toLowerCase() === 'y';
  const hasAnimation = (await question('Has animations? (y/n): ')).toLowerCase() === 'y';

  if (hasHover) analysis.interactions.push({ type: 'hover' });
  if (hasClick) analysis.interactions.push({ type: 'click' });
  if (hasAnimation) analysis.interactions.push({ type: 'animation' });

  return analysis;
}

function generateBasicAnalysis() {
  return {
    layout: {
      type: 'flex',
      direction: 'column',
      gap: '20px',
      hasHeader: false,
      hasFooter: false
    },
    colors: {
      primary: '#0066cc',
      background: '#ffffff',
      text: '#333333'
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      baseFontSize: '16px',
      lineHeight: '1.6'
    },
    components: [
      { type: 'container', description: 'Main container' },
      { type: 'content', description: 'Content area' }
    ],
    interactions: []
  };
}

async function importAnalysisFromFile() {
  const jsonPath = await question('Path to analysis JSON file: ');

  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const analysis = JSON.parse(jsonContent);
    console.log('✓ Analysis imported successfully');
    return analysis;
  } catch (error) {
    console.log(`✗ Error importing analysis: ${error.message}`);
    console.log('Using basic analysis instead...');
    return generateBasicAnalysis();
  }
}

// Clone existing website
async function cloneExistingWebsite() {
  const { cloneWebsite } = require('./website-cloner');

  console.log('\n=== Website Cloner ===\n');
  console.log('Analyze and clone an existing website to AEM EDS blocks.\n');

  const url = await question('Enter website URL (e.g., https://www.example.com): ');

  if (!url) {
    console.log('URL is required');
    return;
  }

  // Validate URL
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.match(/^https?:$/)) {
      console.log('Error: URL must use HTTP or HTTPS protocol');
      return;
    }
  } catch (error) {
    console.log('Error: Invalid URL format');
    return;
  }

  const projectName = await question('Project name (default: cloned-website): ') || 'cloned-website';
  const enableUE = await question('Enable Universal Editor support? (Y/n): ');
  const universalEditor = !enableUE || enableUE.toLowerCase() !== 'n';

  console.log('\nAnalyzing website...');
  console.log('This may take a few moments...\n');

  const result = await cloneWebsite(url, { projectName, universalEditor });

  if (!result.success) {
    console.log(`\n✗ Failed to clone website: ${result.error}\n`);
    return;
  }

  const { analysis, project } = result;

  console.log(`✓ Successfully analyzed ${url}\n`);
  console.log(`Detected ${analysis.components.length} components:\n`);

  analysis.components.forEach(comp => {
    console.log(`  • ${comp.name} (${comp.block}) - ${comp.confidence} confidence`);
  });

  console.log(`\n${project.blocks.length} blocks generated`);
  console.log(`${project.templates.length} templates created`);

  // Create project directory
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    const overwrite = await question(`\nDirectory "${projectName}" already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Cancelled');
      return;
    }
  }

  fs.mkdirSync(projectPath, { recursive: true });

  // Create blocks directory
  const blocksPath = path.join(projectPath, 'blocks');
  fs.mkdirSync(blocksPath, { recursive: true });

  // Write blocks
  project.blocks.forEach(block => {
    const blockPath = path.join(blocksPath, block.name);
    fs.mkdirSync(blockPath, { recursive: true });

    block.files.forEach(file => {
      fs.writeFileSync(path.join(blockPath, file.name), file.content);
    });
  });

  // Write templates
  project.templates.forEach(template => {
    fs.writeFileSync(path.join(projectPath, template.name), template.content);
  });

  // Write README
  fs.writeFileSync(path.join(projectPath, 'README.md'), project.readme);

  console.log(`\n✓ Project created successfully at: ${projectPath}\n`);
  console.log('Next steps:');
  console.log(`  1. cd ${projectName}`);
  console.log('  2. Review and customize the generated blocks');
  console.log('  3. Add actual content from the original site');
  console.log('  4. Adjust styling to match the design');
  console.log('  5. Test with AEM Edge Delivery Services\n');
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
  console.log('5. Component from Image/Screenshot 🎨');
  console.log('6. Initialize new project');
  console.log('7. Clone existing website 🌐');
  console.log('8. Exit\n');

  const choice = await question('Enter your choice (1-8): ');

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
      await generateFromImage();
      break;
    case '6':
      await initProject();
      break;
    case '7':
      await cloneExistingWebsite();
      break;
    case '8':
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

module.exports = {
  templates,
  generateBlock,
  generateComponent,
  generateTemplate,
  initProject,
  generateCoreComponent,
  generateFromImage,
  coreComponents
};
