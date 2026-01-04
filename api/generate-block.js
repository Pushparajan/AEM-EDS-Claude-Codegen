const { templates } = require('../generator');

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
    const { name, options } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Block name is required' });
    }

    const { js, css, className } = templates.block(name, options || {});

    const files = [
      {
        name: `${className}.js`,
        content: js
      },
      {
        name: `${className}.css`,
        content: css
      }
    ];

    res.status(200).json({
      success: true,
      message: `Block "${name}" generated successfully!`,
      className,
      files
    });
  } catch (error) {
    console.error('Error generating block:', error);
    res.status(500).json({ error: 'Failed to generate block' });
  }
};
