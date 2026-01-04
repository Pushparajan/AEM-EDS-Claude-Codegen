const { crawlSite } = require('../site-scraper');
const { generateSite } = require('../site-generator');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');

module.exports = async (req, res) => {
  // Enable CORS
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
    const { url, options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Crawl the site
    const crawlResult = await crawlSite(url, {
      maxPages: options.maxPages || 1,
      timeout: options.timeout || 30000
    });

    if (!crawlResult.success) {
      return res.status(400).json({
        success: false,
        error: crawlResult.error
      });
    }

    // Generate site in a temporary directory
    const tempDir = path.join(tmpdir(), `aem-gen-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const result = generateSite(crawlResult, tempDir);

    // Collect all generated files
    const files = [];

    // Helper to recursively get all files
    function collectFiles(dir, baseDir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
          collectFiles(fullPath, baseDir);
        } else {
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({
            path: relativePath,
            content
          });
        }
      });
    }

    collectFiles(result.path, path.dirname(result.path));

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    res.status(200).json({
      success: true,
      message: `Site "${result.siteName}" generated successfully!`,
      siteName: result.siteName,
      url: crawlResult.url,
      analysis: {
        title: crawlResult.analysis.title,
        componentsCount: crawlResult.analysis.components.length,
        components: crawlResult.analysis.components.map(c => ({
          type: c.type,
          description: c.description
        })),
        patterns: crawlResult.analysis.patterns,
        colors: crawlResult.analysis.colors,
        typography: crawlResult.analysis.typography
      },
      generated: {
        components: result.components.length,
        templates: result.templates.length
      },
      files
    });
  } catch (error) {
    console.error('Error generating site from URL:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate site'
    });
  }
};
