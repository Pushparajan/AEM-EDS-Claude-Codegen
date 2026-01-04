const { cloneWebsite } = require('../website-cloner');

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
    const { url, projectName, universalEditor } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.match(/^https?:$/)) {
        return res.status(400).json({ error: 'URL must use HTTP or HTTPS protocol' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = await cloneWebsite(url, { projectName, universalEditor });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      analysis: result.analysis,
      project: result.project,
    });
  } catch (error) {
    console.error('Error cloning website:', error);
    res.status(500).json({
      error: 'Failed to clone website',
      message: error.message,
    });
  }
};
