const { templates } = require('../generator');

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
      return res.status(400).json({ error: 'Template name is required' });
    }

    const content = templates.template(name);
    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.html`;

    const files = [
      {
        name: fileName,
        content
      }
    ];

    res.status(200).json({
      success: true,
      message: `Template "${name}" generated successfully!`,
      files
    });
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
};
