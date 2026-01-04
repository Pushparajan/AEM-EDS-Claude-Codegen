/**
 * Site Generator Module
 * Generates complete site structure from analysis results
 */

const fs = require('fs');
const path = require('path');
const { templates } = require('./generator');

/**
 * Create folder structure for the site
 * @param {string} siteName - Name of the site
 * @param {string} basePath - Base path where to create the folder
 * @returns {Object} Created paths
 */
function createSiteStructure(siteName, basePath = process.cwd()) {
  const siteDir = path.join(basePath, siteName);
  
  const dirs = {
    root: siteDir,
    components: path.join(siteDir, 'blocks'),
    templates: path.join(siteDir, 'templates'),
    pages: path.join(siteDir, 'pages'),
    scripts: path.join(siteDir, 'scripts'),
    styles: path.join(siteDir, 'styles')
  };
  
  // Create all directories
  Object.values(dirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  return dirs;
}

/**
 * Generate component files from analysis
 * @param {Object} component - Component information
 * @param {string} componentsDir - Path to components directory
 * @param {Object} siteAnalysis - Full site analysis
 * @returns {Object} Generated file info
 */
function generateComponent(component, componentsDir, siteAnalysis) {
  const componentName = component.type;
  const className = componentName.toLowerCase().replace(/\s+/g, '-');
  
  // Determine options based on component type
  const options = {
    hasButtons: ['hero', 'card', 'cta', 'button'].includes(componentName),
    lazyLoad: ['carousel', 'gallery', 'image'].includes(componentName),
    responsive: true
  };
  
  // Generate using existing template
  const { js, css } = templates.block(componentName, options);
  
  // Create component directory
  const componentDir = path.join(componentsDir, className);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }
  
  // Write files
  const jsPath = path.join(componentDir, `${className}.js`);
  const cssPath = path.join(componentDir, `${className}.css`);
  
  fs.writeFileSync(jsPath, js);
  
  // Enhance CSS with site colors
  let enhancedCss = css;
  if (siteAnalysis && siteAnalysis.colors) {
    enhancedCss = enhancedCss.replace(/#0066cc/g, siteAnalysis.colors.primary || '#0066cc');
    enhancedCss = enhancedCss.replace(/#333333/g, siteAnalysis.colors.text || '#333333');
  }
  
  fs.writeFileSync(cssPath, enhancedCss);
  
  return {
    name: componentName,
    className,
    files: [
      path.relative(path.dirname(componentsDir), jsPath),
      path.relative(path.dirname(componentsDir), cssPath)
    ]
  };
}

/**
 * Generate a basic page template
 * @param {string} pageName - Name of the page
 * @param {string} templatesDir - Path to templates directory
 * @param {Object} siteAnalysis - Site analysis data
 * @returns {string} Generated template path
 */
function generatePageTemplate(pageName, templatesDir, siteAnalysis) {
  const fileName = `${pageName.toLowerCase().replace(/\s+/g, '-')}.html`;
  const filePath = path.join(templatesDir, fileName);
  
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteAnalysis.title || pageName}</title>
  <link rel="stylesheet" href="../styles/styles.css">
  <script type="module" src="../scripts/scripts.js"></script>
</head>
<body>
  <!-- Navigation -->
  <header>
    <div class="navigation block">
      <!-- Navigation content here -->
    </div>
  </header>

  <!-- Main Content -->
  <main>
    ${siteAnalysis.components.map(comp => `
    <!-- ${comp.description} -->
    <div class="section">
      <div class="${comp.type} block">
        <!-- ${comp.type} content -->
      </div>
    </div>`).join('\n')}
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer block">
      <!-- Footer content here -->
    </div>
  </footer>
</body>
</html>
`;
  
  fs.writeFileSync(filePath, content);
  
  return fileName;
}

/**
 * Generate main styles file
 * @param {string} stylesDir - Path to styles directory
 * @param {Object} siteAnalysis - Site analysis data
 * @returns {string} Generated file path
 */
function generateStyles(stylesDir, siteAnalysis) {
  const filePath = path.join(stylesDir, 'styles.css');
  
  const colors = siteAnalysis.colors || {
    primary: '#0066cc',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#333333'
  };
  
  const typography = siteAnalysis.typography || {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.6'
  };
  
  const content = `/* Site Styles - Generated from ${siteAnalysis.url} */

:root {
  /* Colors */
  --primary-color: ${colors.primary};
  --secondary-color: ${colors.secondary};
  --background-color: ${colors.background};
  --text-color: ${colors.text};
  
  /* Typography */
  --font-family: ${typography.fontFamily};
  --base-font-size: ${typography.baseFontSize};
  --line-height: ${typography.lineHeight};
}

/* Reset and Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--base-font-size);
  line-height: var(--line-height);
  color: var(--text-color);
  background-color: var(--background-color);
}

/* Layout */
main {
  min-height: 100vh;
}

.section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Block Styles */
.block {
  margin: 20px 0;
}

/* Common Elements */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: opacity 0.3s;
}

a:hover {
  opacity: 0.8;
}

img {
  max-width: 100%;
  height: auto;
}

/* Buttons */
.button,
a.button {
  display: inline-block;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover,
a.button:hover {
  background-color: var(--secondary-color);
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section {
    padding: 20px 10px;
  }
}
`;
  
  fs.writeFileSync(filePath, content);
  
  return 'styles.css';
}

/**
 * Generate main scripts file
 * @param {string} scriptsDir - Path to scripts directory
 * @param {Array} components - List of components
 * @returns {string} Generated file path
 */
function generateScripts(scriptsDir, components) {
  const filePath = path.join(scriptsDir, 'scripts.js');
  
  const content = `/**
 * Main Scripts - Block Loader
 * Automatically loads and decorates blocks on the page
 */

// Map of block names to their decorator functions
const blockModules = new Map();

/**
 * Load a block module dynamically
 * @param {string} blockName - Name of the block
 * @returns {Promise<Function>} The block's decorate function
 */
async function loadBlockModule(blockName) {
  if (blockModules.has(blockName)) {
    return blockModules.get(blockName);
  }

  try {
    const module = await import(\`../blocks/\${blockName}/\${blockName}.js\`);
    const decorateFn = module.default;
    blockModules.set(blockName, decorateFn);
    return decorateFn;
  } catch (error) {
    console.error(\`Failed to load block module: \${blockName}\`, error);
    return null;
  }
}

/**
 * Decorate a block element
 * @param {HTMLElement} block - The block element to decorate
 */
async function decorateBlock(block) {
  const classes = Array.from(block.classList);
  const blockClass = classes.find(c => c !== 'block');

  if (!blockClass) {
    return;
  }

  // Add loading state
  block.dataset.blockStatus = 'loading';

  try {
    const decorateFn = await loadBlockModule(blockClass);
    if (decorateFn) {
      await decorateFn(block);
      block.dataset.blockStatus = 'loaded';
    } else {
      block.dataset.blockStatus = 'error';
    }
  } catch (error) {
    console.error(\`Error decorating block: \${blockClass}\`, error);
    block.dataset.blockStatus = 'error';
  }
}

/**
 * Load all blocks on the page
 */
async function loadBlocks() {
  const blocks = document.querySelectorAll('.block');
  
  // Decorate blocks in parallel
  await Promise.all(
    Array.from(blocks).map(block => decorateBlock(block))
  );
}

/**
 * Initialize the application
 */
function init() {
  // Load blocks when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlocks);
  } else {
    loadBlocks();
  }
}

// Start the application
init();
`;
  
  fs.writeFileSync(filePath, content);
  
  return 'scripts.js';
}

/**
 * Generate README documentation
 * @param {string} rootDir - Root directory of the site
 * @param {Object} siteData - Site generation data
 * @returns {string} Generated file path
 */
function generateReadme(rootDir, siteData) {
  const filePath = path.join(rootDir, 'README.md');
  
  const { siteName, url, analysis, generatedComponents, generatedTemplates } = siteData;
  
  const content = `# ${siteName}

Generated from: [${url}](${url})  
Generated on: ${new Date().toLocaleDateString()}

## Overview

This AEM Edge Delivery Services project was automatically generated by analyzing the website structure and components.

## Structure

\`\`\`
${siteName}/
├── blocks/          # Component blocks
├── templates/       # Page templates
├── pages/          # Page content (for future use)
├── scripts/        # JavaScript files
├── styles/         # CSS files
└── README.md       # This file
\`\`\`

## Generated Components

The following components were identified and generated:

${generatedComponents.map(comp => `- **${comp.name}** - ${comp.description || 'Component block'}
  - Location: \`blocks/${comp.className}/\`
  - Files: ${comp.files.map(f => `\`${path.basename(f)}\``).join(', ')}`).join('\n')}

## Generated Templates

${generatedTemplates.map(template => `- \`templates/${template}\``).join('\n')}

## Detected Patterns

${analysis.patterns.length > 0 
  ? analysis.patterns.map(pattern => `- ${pattern}`).join('\n')
  : '- No specific patterns detected'}

## Color Scheme

- **Primary Color:** ${analysis.colors.primary}
- **Secondary Color:** ${analysis.colors.secondary}
- **Background:** ${analysis.colors.background}
- **Text Color:** ${analysis.colors.text}

## Typography

- **Font Family:** ${analysis.typography.fontFamily}
- **Base Font Size:** ${analysis.typography.baseFontSize}
- **Line Height:** ${analysis.typography.lineHeight}

## Usage

### Development

1. Customize the generated components in the \`blocks/\` directory
2. Modify styles in \`styles/styles.css\`
3. Update templates in \`templates/\`
4. Add your content

### Block Usage

To use a block in your HTML:

\`\`\`html
<div class="block-name block">
  <!-- Block content -->
</div>
\`\`\`

The blocks will be automatically loaded and decorated by \`scripts/scripts.js\`.

## Next Steps

1. **Review Generated Code** - Check all generated components and adjust as needed
2. **Add Content** - Fill in the actual content from the original site
3. **Customize Styling** - Refine colors, typography, and layouts to match exactly
4. **Test Responsiveness** - Ensure all components work well on mobile devices
5. **Add Interactivity** - Implement any JavaScript functionality specific to each component
6. **Optimize Assets** - Add and optimize images, icons, and other media

## Manual Adjustments Needed

- **Images**: Extract and add actual images from the source site
- **Content**: Copy actual text content and structure
- **Interactive Elements**: Implement specific JavaScript interactions
- **Forms**: Add proper form handling and validation
- **Links**: Update navigation and internal links
- **SEO**: Add meta tags, structured data, and analytics

## Resources

- [AEM Edge Delivery Services Documentation](https://www.aem.live/developer/tutorial)
- [Block Development Guide](https://www.aem.live/developer/block-collection)

---

**Note:** This is a starting point generated automatically. Review and customize all code before using in production.
`;
  
  fs.writeFileSync(filePath, content);
  
  return 'README.md';
}

/**
 * Generate complete site from analysis
 * @param {Object} crawlResult - Result from site crawler
 * @param {string} basePath - Base path where to create the site
 * @returns {Object} Generation result
 */
function generateSite(crawlResult, basePath = process.cwd()) {
  if (!crawlResult.success) {
    throw new Error(`Cannot generate site: ${crawlResult.error}`);
  }
  
  const { domainName, url, analysis } = crawlResult;
  
  console.log(`\nGenerating site: ${domainName}`);
  
  // Create folder structure
  console.log('Creating folder structure...');
  const dirs = createSiteStructure(domainName, basePath);
  console.log('✓ Folder structure created');
  
  // Generate components
  console.log('Generating components...');
  const generatedComponents = [];
  
  if (analysis.components && analysis.components.length > 0) {
    analysis.components.forEach(component => {
      try {
        const result = generateComponent(component, dirs.components, analysis);
        generatedComponents.push({
          ...result,
          description: component.description
        });
        console.log(`  ✓ Generated component: ${component.type}`);
      } catch (error) {
        console.log(`  ✗ Failed to generate component ${component.type}: ${error.message}`);
      }
    });
  } else {
    console.log('  No components identified');
  }
  
  // Generate templates
  console.log('Generating templates...');
  const generatedTemplates = [];
  
  try {
    const homeTemplate = generatePageTemplate('home', dirs.templates, analysis);
    generatedTemplates.push(homeTemplate);
    console.log(`  ✓ Generated template: ${homeTemplate}`);
  } catch (error) {
    console.log(`  ✗ Failed to generate template: ${error.message}`);
  }
  
  // Generate styles
  console.log('Generating styles...');
  try {
    const stylesFile = generateStyles(dirs.styles, analysis);
    console.log(`  ✓ Generated: ${stylesFile}`);
  } catch (error) {
    console.log(`  ✗ Failed to generate styles: ${error.message}`);
  }
  
  // Generate scripts
  console.log('Generating scripts...');
  try {
    const scriptsFile = generateScripts(dirs.scripts, generatedComponents);
    console.log(`  ✓ Generated: ${scriptsFile}`);
  } catch (error) {
    console.log(`  ✗ Failed to generate scripts: ${error.message}`);
  }
  
  // Generate README
  console.log('Generating documentation...');
  try {
    const readme = generateReadme(dirs.root, {
      siteName: domainName,
      url,
      analysis,
      generatedComponents,
      generatedTemplates
    });
    console.log(`  ✓ Generated: ${readme}`);
  } catch (error) {
    console.log(`  ✗ Failed to generate README: ${error.message}`);
  }
  
  return {
    success: true,
    siteName: domainName,
    path: dirs.root,
    structure: dirs,
    components: generatedComponents,
    templates: generatedTemplates,
    analysis
  };
}

module.exports = {
  createSiteStructure,
  generateComponent,
  generatePageTemplate,
  generateStyles,
  generateScripts,
  generateReadme,
  generateSite
};
