module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Generate project structure files
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

    const packageJson = {
      name: name,
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

    const files = [
      {
        name: 'scripts/scripts.js',
        content: scriptsJs
      },
      {
        name: 'styles/styles.css',
        content: stylesCss
      },
      {
        name: 'package.json',
        content: JSON.stringify(packageJson, null, 2)
      },
      {
        name: 'README.md',
        content: `# ${name}\n\nAEM Edge Delivery Services Project\n\n## Directory Structure\n\n- \`blocks/\` - AEM EDS blocks\n- \`components/\` - Reusable components\n- \`templates/\` - HTML templates\n- \`scripts/\` - JavaScript files\n- \`styles/\` - CSS files\n- \`icons/\` - SVG icons\n- \`test/\` - Test files\n`
      }
    ];

    res.status(200).json({
      success: true,
      message: `Project "${name}" initialized successfully!`,
      directories: ['blocks', 'components', 'templates', 'scripts', 'styles', 'icons', 'test'],
      files
    });
  } catch (error) {
    console.error('Error initializing project:', error);
    res.status(500).json({ error: 'Failed to initialize project' });
  }
};
