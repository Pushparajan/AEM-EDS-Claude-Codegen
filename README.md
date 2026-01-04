# AEM EDS Code Generator

A powerful command-line tool for generating boilerplate code for Adobe Experience Manager (AEM) Edge Delivery Services projects. Quickly scaffold blocks, components, templates, and entire project structures.

## Features

- 🚀 **Block Generator** - Create AEM EDS blocks with JavaScript and CSS
- 🧩 **Component Generator** - Generate reusable components (functional or class-based)
- 📄 **Template Generator** - Scaffold HTML templates
- 🏗️ **Project Initializer** - Set up complete AEM EDS project structure
- ⚡ **Interactive CLI** - User-friendly prompts for configuration
- 🎨 **Customizable Templates** - Options for buttons, lazy loading, responsive design

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AEM-EDS-Claude-Codegen.git

# Navigate to the directory
cd AEM-EDS-Claude-Codegen

# Make the generator executable
chmod +x generator.js

# Optional: Install globally
npm link
```

## Usage

### Interactive Mode

Run the generator in interactive mode:

```bash
node generator.js
```

You'll be presented with a menu:

```
╔════════════════════════════════════════════╗
║  AEM EDS Code Generator                   ║
╚════════════════════════════════════════════╝

What would you like to generate?

1. Block
2. Component
3. Template
4. Initialize new project
5. Exit
```

### Generate a Block

Blocks are the building blocks of AEM EDS. The generator creates:
- JavaScript file with decoration logic
- CSS file with styles
- Optional features: buttons, lazy loading, responsive design

**Example:**

```bash
# Select option 1 from the menu
Block name: hero
Include button support? (y/n): y
Enable lazy loading? (y/n): n
Add responsive styles? (y/n): y
```

**Generated structure:**
```
blocks/
└── hero/
    ├── hero.js
    └── hero.css
```

**Generated `hero.js`:**
```javascript
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    console.log('Processing row:', row);
  });

  // Button functionality included
  const buttons = block.querySelectorAll('a.button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Handle button click
    });
  });
}
```

### Generate a Component

Components are reusable modules for your application.

**Example:**

```bash
# Select option 2 from the menu
Component name: carousel
Type (functional/class) [functional]: functional
```

**Generated structure:**
```
components/
└── carousel.js
```

### Generate a Template

Create HTML templates for pages.

**Example:**

```bash
# Select option 3 from the menu
Template name: Landing Page
```

**Generated structure:**
```
templates/
└── landing-page.html
```

### Initialize a New Project

Set up a complete AEM EDS project structure with all necessary directories and base files.

**Example:**

```bash
# Select option 4 from the menu
Project name: my-aem-project
```

**Generated structure:**
```
my-aem-project/
├── blocks/
├── components/
├── templates/
├── scripts/
│   └── scripts.js
├── styles/
│   └── styles.css
├── icons/
├── test/
└── package.json
```

## Project Structure

After initialization, your project will have:

```
your-project/
├── blocks/          # AEM EDS blocks
├── components/      # Reusable components
├── templates/       # HTML templates
├── scripts/         # JavaScript files
│   └── scripts.js   # Main script with block loader
├── styles/          # CSS files
│   └── styles.css   # Global styles
├── icons/           # SVG icons
├── test/            # Test files
└── package.json     # Package configuration
```

## Block Development

### Block Anatomy

Each block consists of:
1. **JavaScript file** (`blockname.js`) - Contains the `decorate` function
2. **CSS file** (`blockname.css`) - Contains block styles

### Block Decoration

The `decorate` function is the entry point for block logic:

```javascript
export default function decorate(block) {
  // block is the DOM element
  // Manipulate the block's content and structure
}
```

### Block Features

When generating blocks, you can enable:

- **Button Support** - Adds button event handlers and styles
- **Lazy Loading** - Implements IntersectionObserver for performance
- **Responsive Design** - Includes mobile-friendly media queries

## Component Development

### Functional Components

```javascript
export default function MyComponent(element, options = {}) {
  const config = { ...defaults, ...options };

  function init() {
    // Initialize component
  }

  return {
    init,
    element
  };
}
```

### Class-based Components

```javascript
export default class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Initialize component
  }
}
```

## Best Practices

1. **Block Naming** - Use kebab-case for block names (e.g., `hero-banner`)
2. **CSS Scoping** - Always scope styles to the block class
3. **Lazy Loading** - Use for heavy content like images or videos
4. **Responsive Design** - Always consider mobile-first design
5. **Performance** - Keep blocks lightweight and efficient

## Advanced Usage

### Programmatic API

You can also use the generator programmatically:

```javascript
const { generateBlock, templates } = require('./generator.js');

// Generate a block
const blockCode = templates.block('MyBlock', {
  hasButtons: true,
  lazyLoad: true,
  responsive: true
});

console.log(blockCode.js);  // JavaScript code
console.log(blockCode.css); // CSS code
```

## Customization

### Modifying Templates

Edit the `templates` object in `generator.js` to customize generated code:

```javascript
const templates = {
  block: (name, options) => {
    // Customize block template
  },
  component: (name, type) => {
    // Customize component template
  }
};
```

## Examples

### Example: Hero Block

```html
<!-- In your content -->
<div class="hero">
  <div>
    <div>
      <h1>Welcome to AEM EDS</h1>
      <p>Build faster websites</p>
    </div>
  </div>
  <div>
    <div>
      <a href="/get-started" class="button">Get Started</a>
    </div>
  </div>
</div>
```

### Example: Card Grid Block

Generated with responsive support:

```css
.card-grid > div {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .card-grid > div {
    flex-direction: column;
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## TODO / Future Enhancements

- [ ] Add TypeScript support
- [ ] Include unit test templates
- [ ] Add ESLint configuration generation
- [ ] Support for custom template directories
- [ ] CLI arguments for non-interactive mode
- [ ] Block variants/themes generator
- [ ] Integration with AEM EDS CLI tools
- [ ] Documentation generator for blocks

## License

MIT

## Resources

- [AEM Edge Delivery Services Documentation](https://www.aem.live/developer/tutorial)
- [Block Development Guide](https://www.aem.live/developer/block-collection)
- [AEM EDS GitHub](https://github.com/adobe/aem-boilerplate)

## Support

For issues and questions:
- Create an issue in the repository
- Check the AEM EDS documentation
- Visit the AEM community forums

---

**Happy coding with AEM EDS! 🚀**
