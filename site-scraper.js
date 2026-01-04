/**
 * Site Scraper Module
 * Handles URL validation, crawling, and site analysis for component generation
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Extract domain name from URL
 * @param {string} url - Full URL
 * @returns {string} Clean domain name suitable for folder naming
 */
function extractDomainName(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    
    // Remove www. prefix
    hostname = hostname.replace(/^www\./, '');
    
    // Remove TLD for folder name
    const parts = hostname.split('.');
    if (parts.length > 1) {
      // Return the main domain part (e.g., "starbucksreserve" from "starbucksreserve.com")
      return parts[0];
    }
    
    return hostname;
  } catch (error) {
    throw new Error(`Invalid URL: ${error.message}`);
  }
}

/**
 * Validate URL format and accessibility
 * @param {string} url - URL to validate
 * @returns {Promise<boolean>} True if valid and accessible
 */
async function validateURL(url) {
  try {
    const urlObj = new URL(url);
    
    // Basic protocol check
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
    
    // Try to fetch the URL with a HEAD request
    return new Promise((resolve, reject) => {
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        method: 'HEAD',
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        timeout: 10000,
        headers: {
          'User-Agent': 'AEM-EDS-Generator/1.0'
        }
      };
      
      const req = protocol.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
        } else {
          reject(new Error(`URL returned status code: ${res.statusCode}`));
        }
      });
      
      req.on('error', (error) => {
        reject(new Error(`Cannot access URL: ${error.message}`));
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('URL request timed out'));
      });
      
      req.end();
    });
  } catch (error) {
    throw new Error(`Invalid URL: ${error.message}`);
  }
}

/**
 * Fetch HTML content from URL
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} HTML content
 */
async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AEM-EDS-Generator/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    };
    
    let data = '';
    
    const req = protocol.request(options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url);
        fetchHTML(redirectUrl.href).then(resolve).catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: Status ${res.statusCode}`));
        return;
      }
      
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Failed to fetch HTML: ${error.message}`));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    req.end();
  });
}

/**
 * Analyze HTML structure and identify common patterns
 * @param {string} html - HTML content
 * @param {string} url - Original URL
 * @returns {Object} Analysis results
 */
function analyzeHTML(html, url) {
  const analysis = {
    url,
    title: '',
    components: [],
    sections: [],
    colors: {
      primary: '#0066cc',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#333333'
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      baseFontSize: '16px',
      lineHeight: '1.6'
    },
    patterns: []
  };
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    analysis.title = titleMatch[1].trim();
  }
  
  // Identify common components by looking at class names and structure
  const componentPatterns = [
    { pattern: /class=["'][^"']*(?:header|nav|navigation)[^"']*["']/gi, type: 'navigation', description: 'Navigation header' },
    { pattern: /class=["'][^"']*(?:hero|banner|jumbotron)[^"']*["']/gi, type: 'hero', description: 'Hero banner section' },
    { pattern: /class=["'][^"']*(?:card|product|item)[^"']*["']/gi, type: 'card', description: 'Card component' },
    { pattern: /class=["'][^"']*(?:carousel|slider|slideshow)[^"']*["']/gi, type: 'carousel', description: 'Carousel/slider component' },
    { pattern: /class=["'][^"']*(?:footer)[^"']*["']/gi, type: 'footer', description: 'Footer section' },
    { pattern: /class=["'][^"']*(?:button|btn|cta)[^"']*["']/gi, type: 'button', description: 'Button/CTA element' },
    { pattern: /class=["'][^"']*(?:form|contact)[^"']*["']/gi, type: 'form', description: 'Form component' },
    { pattern: /class=["'][^"']*(?:gallery|grid)[^"']*["']/gi, type: 'gallery', description: 'Gallery/grid layout' },
    { pattern: /class=["'][^"']*(?:tab|accordion)[^"']*["']/gi, type: 'tabs', description: 'Tabs or accordion' },
    { pattern: /class=["'][^"']*(?:testimonial|review)[^"']*["']/gi, type: 'testimonial', description: 'Testimonial component' }
  ];
  
  const foundComponents = new Set();
  
  componentPatterns.forEach(({ pattern, type, description }) => {
    const matches = html.match(pattern);
    if (matches && matches.length > 0 && !foundComponents.has(type)) {
      foundComponents.add(type);
      analysis.components.push({
        type,
        description,
        count: matches.length
      });
    }
  });
  
  // Try to extract color scheme from CSS (basic extraction)
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
    const cssContent = styleMatch[1];
    
    // Look for color definitions
    const colorMatches = cssContent.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g);
    if (colorMatches && colorMatches.length > 0) {
      // Use the first few colors found as a simple heuristic
      if (colorMatches[0]) analysis.colors.primary = colorMatches[0];
      if (colorMatches[1]) analysis.colors.secondary = colorMatches[1];
    }
    
    // Look for font families
    const fontMatch = cssContent.match(/font-family:\s*([^;]+);/i);
    if (fontMatch) {
      analysis.typography.fontFamily = fontMatch[1].trim();
    }
  }
  
  // Identify main sections
  const sectionMatches = html.match(/<(?:section|div)[^>]*class=["'][^"']*section[^"']*["'][^>]*>/gi);
  if (sectionMatches) {
    analysis.sections = sectionMatches.map((match, index) => ({
      id: `section-${index + 1}`,
      detected: true
    }));
  }
  
  // Identify layout patterns
  if (html.match(/display:\s*grid/i) || html.match(/grid-template/i)) {
    analysis.patterns.push('grid-layout');
  }
  if (html.match(/display:\s*flex/i) || html.match(/flexbox/i)) {
    analysis.patterns.push('flexbox-layout');
  }
  if (html.match(/@media/i)) {
    analysis.patterns.push('responsive-design');
  }
  
  return analysis;
}

/**
 * Main function to crawl and analyze a site
 * @param {string} url - URL to analyze
 * @param {Object} options - Crawl options
 * @returns {Promise<Object>} Site analysis
 */
async function crawlSite(url, options = {}) {
  const {
    maxPages = 1, // For now, only analyze the main page to keep it simple
    timeout = 30000,
    followLinks = false
  } = options;
  
  console.log(`Validating URL: ${url}`);
  
  try {
    // Validate URL
    await validateURL(url);
    console.log('✓ URL is valid and accessible');
    
    // Fetch HTML
    console.log('Fetching page content...');
    const html = await fetchHTML(url);
    console.log('✓ Content fetched successfully');
    
    // Analyze HTML
    console.log('Analyzing page structure...');
    const analysis = analyzeHTML(html, url);
    console.log('✓ Analysis complete');
    
    // Extract domain name
    const domainName = extractDomainName(url);
    
    return {
      success: true,
      domainName,
      url,
      analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url
    };
  }
}

/**
 * Delay function for rate limiting
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  extractDomainName,
  validateURL,
  fetchHTML,
  analyzeHTML,
  crawlSite,
  delay
};
