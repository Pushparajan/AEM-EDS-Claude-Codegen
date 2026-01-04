/**
 * AEM EDS Website Cloner
 * Analyzes existing websites and generates equivalent AEM Edge Delivery Services code
 */

const https = require('https');
const http = require('http');

/**
 * Fetches a website's HTML content
 * @param {string} url - The website URL to fetch
 * @returns {Promise<string>} HTML content
 */
function fetchWebsite(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'AEM-EDS-Cloner/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          return fetchWebsite(redirectUrl).then(resolve).catch(reject);
        }
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Analyzes HTML structure and identifies common component patterns
 * @param {string} html - HTML content to analyze
 * @param {string} url - Original URL for context
 * @returns {Object} Analysis results with detected components
 */
function analyzeWebsiteStructure(html, url) {
  const analysis = {
    url,
    components: [],
    structure: {
      hasHeader: false,
      hasHero: false,
      hasNavigation: false,
      hasFooter: false,
      sections: [],
    },
    metadata: {
      title: '',
      description: '',
      hasLogo: false,
    },
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    analysis.metadata.title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (descMatch) {
    analysis.metadata.description = descMatch[1].trim();
  }

  // Detect header
  if (html.match(/<header[\s>]/i) || html.match(/class=["'][^"']*header[^"']*["']/i)) {
    analysis.structure.hasHeader = true;
    analysis.components.push({
      type: 'header',
      name: 'Header',
      confidence: 'high',
      block: 'header',
    });
  }

  // Detect navigation
  if (html.match(/<nav[\s>]/i) || html.match(/class=["'][^"']*nav[^"']*["']/i)) {
    analysis.structure.hasNavigation = true;
    analysis.components.push({
      type: 'navigation',
      name: 'Navigation',
      confidence: 'high',
      block: 'navigation',
    });
  }

  // Detect hero section (first large banner/section)
  const heroPatterns = [
    /class=["'][^"']*hero[^"']*["']/i,
    /class=["'][^"']*banner[^"']*["']/i,
    /class=["'][^"']*jumbotron[^"']*["']/i,
    /class=["'][^"']*splash[^"']*["']/i,
  ];

  if (heroPatterns.some(pattern => html.match(pattern))) {
    analysis.structure.hasHero = true;
    analysis.components.push({
      type: 'hero',
      name: 'Hero Section',
      confidence: 'high',
      block: 'hero',
    });
  }

  // Detect footer
  if (html.match(/<footer[\s>]/i) || html.match(/class=["'][^"']*footer[^"']*["']/i)) {
    analysis.structure.hasFooter = true;
    analysis.components.push({
      type: 'footer',
      name: 'Footer',
      confidence: 'high',
      block: 'footer',
    });
  }

  // Detect card/grid layouts
  const cardPatterns = [
    /class=["'][^"']*card[s]?[^"']*["']/gi,
    /class=["'][^"']*product[s]?[^"']*["']/gi,
    /class=["'][^"']*item[s]?[^"']*["']/gi,
  ];

  cardPatterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches && matches.length >= 2) {
      analysis.components.push({
        type: 'cards',
        name: 'Card Grid',
        confidence: 'medium',
        block: 'cards',
        count: matches.length,
      });
    }
  });

  // Detect carousel/slider
  const carouselPatterns = [
    /class=["'][^"']*carousel[^"']*["']/i,
    /class=["'][^"']*slider[^"']*["']/i,
    /class=["'][^"']*slideshow[^"']*["']/i,
  ];

  if (carouselPatterns.some(pattern => html.match(pattern))) {
    analysis.components.push({
      type: 'carousel',
      name: 'Carousel',
      confidence: 'medium',
      block: 'carousel',
    });
  }

  // Detect accordion
  if (html.match(/class=["'][^"']*accordion[^"']*["']/i)) {
    analysis.components.push({
      type: 'accordion',
      name: 'Accordion',
      confidence: 'medium',
      block: 'accordion',
    });
  }

  // Detect tabs
  if (html.match(/class=["'][^"']*tab[s]?[^"']*["']/i)) {
    analysis.components.push({
      type: 'tabs',
      name: 'Tabs',
      confidence: 'medium',
      block: 'tabs',
    });
  }

  // Detect forms
  const formMatches = html.match(/<form[\s>]/gi);
  if (formMatches && formMatches.length > 0) {
    analysis.components.push({
      type: 'form',
      name: 'Form',
      confidence: 'high',
      block: 'form',
      count: formMatches.length,
    });
  }

  // Detect columns layout
  const columnPatterns = [
    /class=["'][^"']*col[-]?[^"']*["']/gi,
    /class=["'][^"']*column[s]?[^"']*["']/gi,
  ];

  columnPatterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches && matches.length >= 2) {
      analysis.components.push({
        type: 'columns',
        name: 'Columns Layout',
        confidence: 'medium',
        block: 'columns',
      });
    }
  });

  // Detect image galleries
  const imgMatches = html.match(/<img[^>]*>/gi);
  if (imgMatches && imgMatches.length > 5) {
    const galleryPattern = /class=["'][^"']*gallery[^"']*["']/i;
    if (html.match(galleryPattern)) {
      analysis.components.push({
        type: 'gallery',
        name: 'Image Gallery',
        confidence: 'medium',
        block: 'gallery',
        imageCount: imgMatches.length,
      });
    }
  }

  // Detect testimonials
  if (html.match(/class=["'][^"']*testimonial[s]?[^"']*["']/i)) {
    analysis.components.push({
      type: 'testimonials',
      name: 'Testimonials',
      confidence: 'medium',
      block: 'testimonials',
    });
  }

  // Detect CTA sections
  if (html.match(/class=["'][^"']*cta[^"']*["']/i) ||
      html.match(/class=["'][^"']*call-to-action[^"']*["']/i)) {
    analysis.components.push({
      type: 'cta',
      name: 'Call to Action',
      confidence: 'medium',
      block: 'cta',
    });
  }

  // Deduplicate components by type
  const seen = new Set();
  analysis.components = analysis.components.filter(comp => {
    if (seen.has(comp.type)) {
      return false;
    }
    seen.add(comp.type);
    return true;
  });

  return analysis;
}

/**
 * Generates AEM EDS project structure based on analysis
 * @param {Object} analysis - Website analysis results
 * @param {Object} options - Generation options
 * @returns {Object} Generated project structure
 */
function generateProjectFromAnalysis(analysis, options = {}) {
  const { templates } = require('./generator');
  const { coreComponents } = require('./core-components');

  const projectName = options.projectName || 'cloned-website';
  const blocks = [];
  const structure = {
    projectName,
    metadata: analysis.metadata,
    blocks: [],
    templates: [],
    scripts: [],
    styles: [],
  };

  // Generate blocks based on detected components
  analysis.components.forEach(component => {
    let blockCode;

    // Try to use core components first
    const coreComponent = Object.values(coreComponents)
      .flat()
      .find(c => c.name.toLowerCase().includes(component.type));

    if (coreComponent) {
      // Use core component
      blockCode = {
        name: component.block,
        type: 'core',
        source: coreComponent,
        files: [{
          name: `${component.block}.js`,
          content: `// ${coreComponent.name}\n// ${coreComponent.description}\n\n${coreComponent.code}`,
        }],
      };
    } else {
      // Generate custom block
      const blockOptions = {
        hasButtons: component.type === 'hero' || component.type === 'cta',
        lazyLoad: component.type === 'carousel' || component.type === 'gallery',
        responsive: true,
        universalEditor: options.universalEditor !== false,
      };

      const { js, css, className } = templates.block(component.name, blockOptions);

      blockCode = {
        name: component.block,
        type: 'custom',
        files: [
          {
            name: `${className}.js`,
            content: js,
          },
          {
            name: `${className}.css`,
            content: css,
          },
        ],
      };
    }

    structure.blocks.push(blockCode);
  });

  // Generate main template
  const templateCode = templates.template(analysis.metadata.title || projectName);
  structure.templates.push({
    name: 'index.html',
    content: templateCode,
  });

  // Generate README with analysis summary
  structure.readme = generateCloneReadme(analysis, projectName);

  return structure;
}

/**
 * Generates README for cloned project
 * @param {Object} analysis - Website analysis
 * @param {string} projectName - Project name
 * @returns {string} README content
 */
function generateCloneReadme(analysis, projectName) {
  const componentList = analysis.components
    .map(c => `- **${c.name}** (${c.block}) - Confidence: ${c.confidence}`)
    .join('\n');

  return `# ${projectName}

> AEM Edge Delivery Services clone of ${analysis.url}

## Project Overview

This project was automatically generated by analyzing the website structure and components.

**Original Website:** ${analysis.url}

**Title:** ${analysis.metadata.title || 'N/A'}

**Description:** ${analysis.metadata.description || 'N/A'}

## Detected Components

${componentList}

## Project Structure

\`\`\`
${projectName}/
├── blocks/           # Generated blocks
├── scripts/          # JavaScript utilities
├── styles/           # CSS styles
└── index.html        # Main template
\`\`\`

## Getting Started

1. Review and customize the generated blocks
2. Update content in index.html
3. Adjust styles as needed
4. Test with AEM Edge Delivery Services

## Next Steps

- [ ] Customize block implementations
- [ ] Add actual content from ${analysis.url}
- [ ] Adjust styling to match original design
- [ ] Test responsive behavior
- [ ] Add component models for Universal Editor
- [ ] Configure deployment

## Notes

- This is a structural clone based on detected patterns
- Content and exact styling need manual adjustment
- Review all blocks for accuracy
- Add proper error handling and edge cases

---

Generated by AEM EDS Code Generator
`;
}

/**
 * Main function to clone a website
 * @param {string} url - Website URL to clone
 * @param {Object} options - Clone options
 * @returns {Promise<Object>} Generated project
 */
async function cloneWebsite(url, options = {}) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.match(/^https?:$/)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }

    // Fetch website
    const html = await fetchWebsite(url);

    // Analyze structure
    const analysis = analyzeWebsiteStructure(html, url);

    // Generate project
    const project = generateProjectFromAnalysis(analysis, options);

    return {
      success: true,
      analysis,
      project,
      message: `Successfully analyzed ${url} and generated ${project.blocks.length} blocks`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Failed to clone website: ${error.message}`,
    };
  }
}

module.exports = {
  fetchWebsite,
  analyzeWebsiteStructure,
  generateProjectFromAnalysis,
  cloneWebsite,
};
