const { coreComponents } = require('../core-components');

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
    const { component, category } = req.body;

    if (!component) {
      return res.status(400).json({ error: 'Component name is required' });
    }

    const selectedComponent = coreComponents[component];

    if (!selectedComponent) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const className = component.toLowerCase().replace(/\s+/g, '-');

    const files = [
      {
        name: `${className}.js`,
        content: selectedComponent.js
      },
      {
        name: `${className}.css`,
        content: selectedComponent.css
      }
    ];

    res.status(200).json({
      success: true,
      message: `Core component "${component}" generated successfully!`,
      category: category || selectedComponent.category,
      description: selectedComponent.description,
      files
    });
  } catch (error) {
    console.error('Error generating core component:', error);
    res.status(500).json({ error: 'Failed to generate core component' });
  }
};
