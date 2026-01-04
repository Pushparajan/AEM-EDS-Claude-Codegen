const { coreComponents, componentCategories } = require('../../../core-components');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;

    if (!category || !componentCategories[category]) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const componentNames = componentCategories[category];
    const components = componentNames.map(name => ({
      name,
      description: coreComponents[name].description,
      category: coreComponents[name].category
    }));

    res.status(200).json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
};
