#!/usr/bin/env node

/**
 * AEM EDS Code Generator - MCP Server
 * Model Context Protocol server for AI-assisted AEM Edge Delivery Services development
 *
 * This MCP server exposes code generation tools for use with AI coding assistants
 * like Claude, Cursor, and other MCP-compatible tools.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

const { templates } = require('../generator');
const { coreComponents, componentCategories } = require('../core-components');
const { generateFromImageWithAI } = require('../image-analyzer');
const { cloneWebsite } = require('../website-cloner');

// Initialize MCP server
const server = new Server(
  {
    name: 'aem-eds-codegen',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool Definitions
 */
const TOOLS = [
  {
    name: 'generate_block',
    description: 'Generate a custom AEM Edge Delivery Services block with JavaScript and CSS. Blocks are the core building units of AEM EDS pages. Supports AEM Universal Editor by default for in-context editing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the block (e.g., "hero", "carousel", "card-grid")',
        },
        hasButtons: {
          type: 'boolean',
          description: 'Include button support with event handlers',
          default: false,
        },
        lazyLoad: {
          type: 'boolean',
          description: 'Enable lazy loading with IntersectionObserver',
          default: false,
        },
        responsive: {
          type: 'boolean',
          description: 'Add responsive design with media queries',
          default: true,
        },
        universalEditor: {
          type: 'boolean',
          description: 'Include AEM Universal Editor instrumentation support (data-aue-* attributes handling)',
          default: true,
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'generate_component',
    description: 'Generate a reusable JavaScript component (functional or class-based) for AEM EDS projects.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the component (e.g., "Carousel", "Modal", "Dropdown")',
        },
        type: {
          type: 'string',
          enum: ['functional', 'class'],
          description: 'Component type: functional (default) or class-based',
          default: 'functional',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'generate_template',
    description: 'Generate an HTML page template with proper AEM EDS structure including scripts and styles.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the template (e.g., "Landing Page", "Product Detail")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_core_component_categories',
    description: 'List all available categories in the AEM Core WCM Components library (30+ production-ready components).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_components_by_category',
    description: 'List all components available in a specific category from the core library.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['template', 'content', 'container', 'form'],
          description: 'Component category: template, content, container, or form',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'generate_core_component',
    description: 'Generate a production-ready component from the AEM Core WCM Components library. Includes accessibility, responsive design, and best practices.',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the core component (e.g., "navigation", "carousel", "accordion", "form")',
        },
        category: {
          type: 'string',
          enum: ['template', 'content', 'container', 'form'],
          description: 'Category the component belongs to',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'generate_from_image_analysis',
    description: 'Generate a component from image analysis data. Provide layout, colors, typography, and interaction details to create matching code.',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name for the generated component',
        },
        analysis: {
          type: 'object',
          description: 'Image analysis object with layout, colors, typography, components, and interactions',
          properties: {
            layout: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['grid', 'flex', 'block'] },
                columns: { type: 'string' },
                gap: { type: 'string' },
                hasHeader: { type: 'boolean' },
                hasFooter: { type: 'boolean' },
              },
            },
            colors: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                background: { type: 'string' },
                text: { type: 'string' },
              },
            },
            typography: {
              type: 'object',
              properties: {
                fontFamily: { type: 'string' },
                baseFontSize: { type: 'string' },
                lineHeight: { type: 'string' },
              },
            },
            components: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
            interactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['hover', 'click', 'animation'] },
                },
              },
            },
          },
        },
      },
      required: ['componentName', 'analysis'],
    },
  },
  {
    name: 'init_aem_project',
    description: 'Initialize a complete AEM Edge Delivery Services project structure with all necessary directories and base files.',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project (will create directory with this name)',
        },
      },
      required: ['projectName'],
    },
  },
  {
    name: 'get_component_info',
    description: 'Get detailed information about a specific core component including its description, category, and usage.',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the component to get info about',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'search_components',
    description: 'Search for components by keyword across all categories.',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: 'Search keyword (searches in component names and descriptions)',
        },
      },
      required: ['keyword'],
    },
  },
  {
    name: 'clone_website',
    description: 'Analyze and clone an existing website to AEM Edge Delivery Services. Automatically detects components like hero sections, navigation, cards, carousels, forms, etc., and generates equivalent AEM EDS blocks and project structure.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Full URL of the website to clone (e.g., "https://www.example.com")',
        },
        projectName: {
          type: 'string',
          description: 'Name for the generated project (optional, defaults to "cloned-website")',
        },
        universalEditor: {
          type: 'boolean',
          description: 'Include Universal Editor support in generated blocks (default: true)',
          default: true,
        },
      },
      required: ['url'],
    },
  },
];

/**
 * Register tool handlers
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_block':
        return handleGenerateBlock(args);

      case 'generate_component':
        return handleGenerateComponent(args);

      case 'generate_template':
        return handleGenerateTemplate(args);

      case 'list_core_component_categories':
        return handleListCategories();

      case 'list_components_by_category':
        return handleListComponentsByCategory(args);

      case 'generate_core_component':
        return handleGenerateCoreComponent(args);

      case 'generate_from_image_analysis':
        return handleGenerateFromImageAnalysis(args);

      case 'init_aem_project':
        return handleInitProject(args);

      case 'get_component_info':
        return handleGetComponentInfo(args);

      case 'search_components':
        return handleSearchComponents(args);

      case 'clone_website':
        return await handleCloneWebsite(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Tool Handlers
 */

function handleGenerateBlock(args) {
  const { name, hasButtons = false, lazyLoad = false, responsive = true, universalEditor = true } = args;
  const { js, css, className } = templates.block(name, { hasButtons, lazyLoad, responsive, universalEditor });

  const message = universalEditor
    ? `Generated block "${name}" (${className}) with AEM Universal Editor support\n\nFiles created:\n- ${className}.js (includes moveInstrumentation helper)\n- ${className}.css\n\nNote: Block includes data-aue-* attribute handling for in-context editing.`
    : `Generated block "${name}" (${className})\n\nFiles created:\n- ${className}.js\n- ${className}.css`;

  return {
    content: [
      {
        type: 'text',
        text: message,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${className}/${className}.js`,
          mimeType: 'text/javascript',
          text: js,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${className}/${className}.css`,
          mimeType: 'text/css',
          text: css,
        },
      },
    ],
  };
}

function handleGenerateComponent(args) {
  const { name, type = 'functional' } = args;
  const content = templates.component(name, type);
  const fileName = `${name.toLowerCase()}.js`;

  return {
    content: [
      {
        type: 'text',
        text: `Generated ${type} component "${name}"\n\nFile created:\n- ${fileName}`,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://components/${fileName}`,
          mimeType: 'text/javascript',
          text: content,
        },
      },
    ],
  };
}

function handleGenerateTemplate(args) {
  const { name } = args;
  const content = templates.template(name);
  const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.html`;

  return {
    content: [
      {
        type: 'text',
        text: `Generated template "${name}"\n\nFile created:\n- ${fileName}`,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://templates/${fileName}`,
          mimeType: 'text/html',
          text: content,
        },
      },
    ],
  };
}

function handleListCategories() {
  const categories = Object.keys(componentCategories);
  const categoryInfo = categories.map(cat => {
    const count = componentCategories[cat].length;
    return `- ${cat}: ${count} components`;
  });

  return {
    content: [
      {
        type: 'text',
        text: `Available Core Component Categories:\n\n${categoryInfo.join('\n')}\n\nTotal: ${categories.length} categories`,
      },
    ],
  };
}

function handleListComponentsByCategory(args) {
  const { category } = args;

  if (!componentCategories[category]) {
    throw new Error(`Invalid category: ${category}. Available: ${Object.keys(componentCategories).join(', ')}`);
  }

  const components = componentCategories[category];
  const componentInfo = components.map(name => {
    const comp = coreComponents[name];
    return `- ${name}: ${comp.description}`;
  });

  return {
    content: [
      {
        type: 'text',
        text: `Components in "${category}" category:\n\n${componentInfo.join('\n')}\n\nTotal: ${components.length} components`,
      },
    ],
  };
}

function handleGenerateCoreComponent(args) {
  const { componentName, category } = args;

  const component = coreComponents[componentName];
  if (!component) {
    throw new Error(`Component "${componentName}" not found in core library`);
  }

  const className = componentName.toLowerCase().replace(/\s+/g, '-');

  return {
    content: [
      {
        type: 'text',
        text: `Generated core component "${componentName}"\n\nCategory: ${component.category}\nDescription: ${component.description}\n\nFiles created:\n- ${className}.js\n- ${className}.css`,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${className}/${className}.js`,
          mimeType: 'text/javascript',
          text: component.js,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${className}/${className}.css`,
          mimeType: 'text/css',
          text: component.css,
        },
      },
    ],
  };
}

function handleGenerateFromImageAnalysis(args) {
  const { componentName, analysis } = args;

  const component = generateFromImageWithAI(
    { path: 'user-provided-analysis' },
    componentName,
    analysis
  );

  return {
    content: [
      {
        type: 'text',
        text: `Generated component "${componentName}" from image analysis\n\nFiles created:\n- ${component.className}.html\n- ${component.className}.js\n- ${component.className}.css\n- analysis.json`,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${component.className}/${component.className}.html`,
          mimeType: 'text/html',
          text: component.html,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${component.className}/${component.className}.js`,
          mimeType: 'text/javascript',
          text: component.js,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://blocks/${component.className}/${component.className}.css`,
          mimeType: 'text/css',
          text: component.css,
        },
      },
    ],
  };
}

function handleInitProject(args) {
  const { projectName } = args;

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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
  loadBlocks();
}`;

  const stylesCss = `:root {
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  color: var(--text-color);
  line-height: 1.6;
}`;

  const packageJson = JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: 'AEM Edge Delivery Services Project',
    type: 'module',
    scripts: { test: 'echo "No tests"' },
    keywords: ['aem', 'eds'],
    license: 'MIT'
  }, null, 2);

  return {
    content: [
      {
        type: 'text',
        text: `Initialized AEM EDS project "${projectName}"\n\nDirectories: blocks, components, templates, scripts, styles, icons, test\n\nFiles created:\n- scripts/scripts.js\n- styles/styles.css\n- package.json`,
      },
      {
        type: 'resource',
        resource: {
          uri: `file://${projectName}/scripts/scripts.js`,
          mimeType: 'text/javascript',
          text: scriptsJs,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://${projectName}/styles/styles.css`,
          mimeType: 'text/css',
          text: stylesCss,
        },
      },
      {
        type: 'resource',
        resource: {
          uri: `file://${projectName}/package.json`,
          mimeType: 'application/json',
          text: packageJson,
        },
      },
    ],
  };
}

function handleGetComponentInfo(args) {
  const { componentName } = args;

  const component = coreComponents[componentName];
  if (!component) {
    throw new Error(`Component "${componentName}" not found`);
  }

  return {
    content: [
      {
        type: 'text',
        text: `Component: ${componentName}\n\nCategory: ${component.category}\nDescription: ${component.description}\n\nFeatures:\n- Accessibility (ARIA labels)\n- Responsive design\n- Semantic HTML\n- BEM CSS conventions\n- Production-ready`,
      },
    ],
  };
}

function handleSearchComponents(args) {
  const { keyword } = args;
  const searchTerm = keyword.toLowerCase();

  const results = [];
  Object.keys(coreComponents).forEach(name => {
    const comp = coreComponents[name];
    if (
      name.toLowerCase().includes(searchTerm) ||
      comp.description.toLowerCase().includes(searchTerm)
    ) {
      results.push(`- ${name} (${comp.category}): ${comp.description}`);
    }
  });

  if (results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No components found matching "${keyword}"`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `Found ${results.length} component(s) matching "${keyword}":\n\n${results.join('\n')}`,
      },
    ],
  };
}

async function handleCloneWebsite(args) {
  const { url, projectName, universalEditor = true } = args;

  const result = await cloneWebsite(url, { projectName, universalEditor });

  if (!result.success) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to clone website: ${result.error}`,
        },
      ],
      isError: true,
    };
  }

  const { analysis, project } = result;

  // Format component list
  const componentList = analysis.components
    .map(c => `- ${c.name} (${c.block}) - ${c.confidence} confidence`)
    .join('\n');

  // Generate summary
  let summary = `Successfully cloned ${url}\n\n`;
  summary += `**Detected Components (${analysis.components.length}):**\n${componentList}\n\n`;
  summary += `**Project Structure:**\n`;
  summary += `- ${project.blocks.length} blocks generated\n`;
  summary += `- ${project.templates.length} templates created\n`;
  summary += `- Universal Editor: ${universalEditor ? 'Enabled' : 'Disabled'}\n\n`;
  summary += `**Metadata:**\n`;
  summary += `- Title: ${analysis.metadata.title || 'N/A'}\n`;
  summary += `- Description: ${analysis.metadata.description || 'N/A'}\n`;

  // Build response with all generated files
  const content = [
    {
      type: 'text',
      text: summary,
    },
  ];

  // Add README
  content.push({
    type: 'resource',
    resource: {
      uri: `file://${project.projectName}/README.md`,
      mimeType: 'text/markdown',
      text: project.readme,
    },
  });

  // Add all block files
  project.blocks.forEach(block => {
    block.files.forEach(file => {
      const mimeType = file.name.endsWith('.js') ? 'text/javascript' :
                       file.name.endsWith('.css') ? 'text/css' : 'text/plain';
      content.push({
        type: 'resource',
        resource: {
          uri: `file://${project.projectName}/blocks/${block.name}/${file.name}`,
          mimeType,
          text: file.content,
        },
      });
    });
  });

  // Add templates
  project.templates.forEach(template => {
    content.push({
      type: 'resource',
      resource: {
        uri: `file://${project.projectName}/${template.name}`,
        mimeType: 'text/html',
        text: template.content,
      },
    });
  });

  return { content };
}

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AEM EDS Code Generator MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
