const { generateFromImageWithAI } = require('../image-analyzer');
const multiparty = require('multiparty');

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
    // Parse multipart form data
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const componentName = fields.componentName?.[0];
      const analysisJson = fields.analysis?.[0];
      const imageFile = files.image?.[0];

      if (!componentName || !analysisJson) {
        return res.status(400).json({ error: 'Component name and analysis are required' });
      }

      let analysis;
      try {
        analysis = JSON.parse(analysisJson);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid analysis JSON' });
      }

      // Generate component
      const imageData = {
        path: imageFile?.path || '',
        name: imageFile?.originalFilename || 'image'
      };

      const component = generateFromImageWithAI(imageData, componentName, analysis);

      const files = [
        {
          name: `${component.className}.html`,
          content: component.html
        },
        {
          name: `${component.className}.js`,
          content: component.js
        },
        {
          name: `${component.className}.css`,
          content: component.css
        },
        {
          name: 'analysis.json',
          content: JSON.stringify(analysis, null, 2)
        }
      ];

      res.status(200).json({
        success: true,
        message: `Component "${componentName}" generated from image!`,
        files
      });
    });
  } catch (error) {
    console.error('Error generating from image:', error);
    res.status(500).json({ error: 'Failed to generate component from image' });
  }
};
