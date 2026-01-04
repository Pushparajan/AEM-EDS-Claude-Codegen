# AEM EDS Code Generator

A powerful command-line tool for generating boilerplate code for Adobe Experience Manager (AEM) Edge Delivery Services projects. Quickly scaffold blocks, components, templates, and entire project structures.

## Features

- 🚀 **Block Generator** - Create custom AEM EDS blocks with JavaScript and CSS
- 🧩 **Component Generator** - Generate reusable components (functional or class-based)
- 📄 **Template Generator** - Scaffold HTML templates
- 🏗️ **Project Initializer** - Set up complete AEM EDS project structure
- ⚡ **Interactive CLI** - User-friendly prompts for configuration
- 🎨 **Customizable Templates** - Options for buttons, lazy loading, responsive design
- 📦 **Core Component Library** - 30+ pre-built components based on Adobe AEM Core WCM Components
  - Template Components (Page, Navigation, Breadcrumb, Search)
  - Content Components (Title, Text, Image, Button, Teaser)
  - Container Components (Carousel, Tabs, Accordion)
  - Form Components (Form with validation)
- 🎨 **Image-to-Component** - NEW! Generate components from UI screenshots/Figma designs
  - Interactive guided analysis
  - AI-assisted image analysis integration
  - JSON template support for design systems
  - Automatically generates HTML, CSS, and JavaScript from visual designs

## Installation

### Web Application (Recommended)

🌐 **Try it online**: Deploy your own instance with one click!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)

### CLI Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AEM-EDS-Claude-Codegen.git

# Navigate to the directory
cd AEM-EDS-Claude-Codegen

# Install dependencies
npm install

# Make the generator executable
chmod +x generator.js

# Optional: Install globally
npm link
```

## Usage

### Web Application

Access the web interface at your deployed URL or run locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

**Web App Features:**
- 🎨 Beautiful, responsive UI
- 📱 Works on desktop and mobile
- 💾 Download generated files instantly
- 🖼️ Upload images for component generation
- ⚡ Real-time code generation
- 🚀 No installation required

### CLI Mode

Run the generator in interactive CLI mode:

```bash
node generator.js
```

You'll be presented with a menu:

```
╔════════════════════════════════════════════╗
║  AEM EDS Code Generator                   ║
╚════════════════════════════════════════════╝

What would you like to generate?

1. Custom Block
2. Custom Component
3. Template
4. Core Component (from library)
5. Component from Image/Screenshot 🎨
6. Initialize new project
7. Exit
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

### Generate from Core Component Library

Access 30+ pre-built, production-ready components based on Adobe's AEM Core WCM Components.

**Example:**

```bash
# Select option 4 from the menu
=== Core Component Library ===

Available component categories:

1. Template Components
2. Content Components
3. Container Components
4. Form Components

Select category (1-4): 3

Container Components:

1. Carousel - Image or content carousel with navigation controls
2. Tabs - Tabbed content interface
3. Accordion - Expandable accordion panels

Select component (1-3): 2
```

**Result:**
```
✓ Core component "tabs" created successfully!
  Category: container
  Location: blocks/tabs/
  Files: tabs.js, tabs.css
  Description: Tabbed content interface
```

#### Available Core Components

**Template Components:**
- **Page** - Foundation page component with header, main, footer structure
- **Navigation** - Primary site navigation with dropdown support
- **Breadcrumb** - Hierarchical page navigation breadcrumb trail
- **Search** - Quick search functionality with autocomplete

**Content Components:**
- **Title** - Page or section title with customizable heading level
- **Text** - Rich text content with formatting support
- **Image** - Responsive image with lazy loading and caption support
- **Button** - Call-to-action button with variants (primary, secondary, outline)
- **Teaser** - Promotional teaser card with image, title, description, and CTA

**Container Components:**
- **Carousel** - Image or content carousel with navigation controls and auto-play
- **Tabs** - Tabbed content interface with ARIA accessibility
- **Accordion** - Expandable accordion panels with smooth animations

**Form Components:**
- **Form** - Form container with validation, error handling, and async submission

All core components include:
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Responsive design
- ✅ Semantic HTML
- ✅ BEM CSS naming conventions
- ✅ Production-ready code

### Generate Component from Image/Screenshot 🎨

**NEW!** Transform UI screenshots or Figma designs into working code automatically.

This powerful feature analyzes images of user interfaces and generates corresponding HTML, CSS, and JavaScript code. Perfect for converting designs into components quickly.

**How it works:**

```bash
# Select option 5 from the menu
=== Generate Component from Image ===

Image path: /path/to/screenshot.png
✓ Image found: screenshot.png (245.67 KB)

Component name: product-card

=== Image Analysis Mode ===

Choose how to analyze the image:

1. Interactive description (recommended)
2. Auto-generate template (basic structure)
3. Import analysis from JSON file

Select mode (1-3): 1
```

#### Analysis Modes

**1. Interactive Description (Recommended)**

The generator guides you through describing the UI:

```bash
=== Interactive Image Analysis ===

--- Layout ---
Layout type (grid/flex/block) [flex]: grid
Number of columns [auto-fit]: repeat(3, 1fr)
Gap/spacing between elements [20px]: 24px
Has header section? (y/n): y
Has footer section? (y/n): n

--- Colors ---
Primary color [#0066cc]: #007bff
Background color [#ffffff]: #f8f9fa
Text color [#333333]: #212529

--- Typography ---
Font family [system-ui, sans-serif]: Inter, sans-serif
Base font size [16px]: 16px
Line height [1.6]: 1.5

--- Components ---
List the UI components you see:

Component type: card
  Brief description: Product card with image and details

Component type: button
  Brief description: Add to cart button

Component type: (press Enter to finish)

--- Interactions ---
Has hover effects? (y/n): y
Has click interactions? (y/n): y
Has animations? (y/n): n
```

**2. Auto-generate Template**

Quickly creates a basic structure without questions. Good for rapid prototyping.

**3. Import from JSON**

Use a pre-defined analysis file. Perfect for:
- Reusing design patterns
- Team collaboration
- Design systems

**Example JSON template:**

```json
{
  "layout": {
    "type": "grid",
    "columns": "repeat(3, 1fr)",
    "gap": "24px"
  },
  "colors": {
    "primary": "#0066cc",
    "background": "#ffffff",
    "text": "#333333"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "baseFontSize": "16px",
    "lineHeight": "1.6"
  },
  "components": [
    { "type": "card", "description": "Product card" },
    { "type": "button", "description": "CTA button" }
  ],
  "interactions": [
    { "type": "hover" },
    { "type": "click" }
  ]
}
```

See `examples/analysis-template.json` for a complete template.

#### Generated Output

After analysis, the generator creates:

```
✓ Component "product-card" created from image!
  Location: blocks/product-card/
  Files:
    - product-card.html (reference structure)
    - product-card.js
    - product-card.css
    - analysis.json (for future reference)

💡 Tip: Review and customize the generated code to match your exact design.
```

#### Best Practices for Image-to-Component

1. **Use High-Quality Screenshots**
   - Clear, high-resolution images work best
   - Ensure text is readable
   - Include the full component in frame

2. **Prepare Before Analysis**
   - Have color codes ready (use a color picker tool)
   - Know your font families
   - Identify layout patterns (grid vs flex)

3. **Use JSON Templates for Design Systems**
   - Create reusable analysis templates
   - Share across team members
   - Maintain consistency

4. **Iterative Refinement**
   - Start with auto-generate for speed
   - Use interactive mode for precision
   - Customize the generated code as needed

5. **AI-Assisted Analysis**
   - Use Claude or other AI vision models to analyze your image
   - Export the analysis as JSON
   - Import into the generator for instant code generation

#### Advanced: Using AI Vision for Analysis

For best results, use an AI vision model like Claude:

1. Upload your screenshot to Claude
2. Ask: "Analyze this UI component and provide a JSON analysis with layout, colors, typography, components, and interactions"
3. Save the response as a JSON file
4. Import it using option 3

**Example prompt for Claude:**

```
Please analyze this UI screenshot and provide a detailed JSON analysis including:
- Layout structure (grid/flex, columns, spacing)
- Color palette (primary, secondary, background, text colors with hex codes)
- Typography (font family, sizes, weights, line heights)
- UI components present (buttons, cards, forms, etc.)
- Interactive elements (hover effects, animations, click actions)
- Responsive considerations

Format as a JSON object matching this structure:
{
  "layout": { "type": "", "columns": "", "gap": "" },
  "colors": { "primary": "", "background": "", "text": "" },
  "typography": { "fontFamily": "", "baseFontSize": "", "lineHeight": "" },
  "components": [{ "type": "", "description": "" }],
  "interactions": [{ "type": "", "effect": "" }]
}
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

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or use the deploy script
npm run deploy:vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or use the deploy script
npm run deploy:netlify
```

📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions, troubleshooting, and configuration details.

## API Endpoints

When deployed as a web app, these RESTful API endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-block` | POST | Generate custom AEM EDS blocks |
| `/api/generate-component` | POST | Generate custom components |
| `/api/generate-template` | POST | Generate HTML templates |
| `/api/core-components/categories` | GET | List all component categories |
| `/api/core-components/category/:category` | GET | Get components by category |
| `/api/generate-core-component` | POST | Generate from core library |
| `/api/generate-from-image` | POST | Generate component from image |
| `/api/init-project` | POST | Initialize project structure |

**Example API Request:**

```bash
curl -X POST https://your-app.vercel.app/api/generate-block \
  -H "Content-Type: application/json" \
  -d '{
    "name": "hero",
    "options": {
      "hasButtons": true,
      "lazyLoad": false,
      "responsive": true
    }
  }'
```

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start CLI mode
npm start

# Start web server (Vercel dev)
npm run dev

# Build
npm run build
```

### Project Structure

```
AEM-EDS-Claude-Codegen/
├── public/                     # Web application
│   ├── index.html             # Main UI
│   ├── styles.css             # Styling
│   └── app.js                 # Frontend logic
├── api/                       # Serverless functions
│   ├── generate-block.js
│   ├── generate-component.js
│   ├── generate-template.js
│   ├── generate-core-component.js
│   ├── generate-from-image.js
│   ├── init-project.js
│   └── core-components/
│       ├── categories.js
│       └── category/[category].js
├── generator.js               # CLI application
├── core-components.js         # Component library (30+ components)
├── image-analyzer.js          # Image-to-component logic
├── examples/                  # Example outputs
│   ├── hero-block.js
│   ├── carousel-component.js
│   └── analysis-template.json
├── vercel.json               # Vercel configuration
├── netlify.toml              # Netlify configuration
├── package.json              # Dependencies & scripts
├── README.md                 # This file
└── DEPLOYMENT.md             # Deployment guide
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## TODO / Future Enhancements

- [x] Core Component Library (30+ components based on Adobe AEM Core WCM Components)
- [x] Image-to-Component generation (transform screenshots/Figma to code)
- [ ] Direct AI vision integration (automatic image analysis without prompts)
- [ ] Add remaining AEM Core components (List, Download, PDF Viewer, Embed, etc.)
- [ ] Figma plugin for direct export to code
- [ ] Add TypeScript support for generated components
- [ ] Include unit test templates (Jest/Vitest)
- [ ] Add ESLint configuration generation
- [ ] Support for custom template directories
- [ ] CLI arguments for non-interactive mode (e.g., `aem-gen block hero`)
- [ ] Block variants/themes generator
- [ ] Integration with AEM EDS CLI tools
- [ ] Documentation generator for blocks
- [ ] Component preview/storybook integration
- [ ] Multi-language support in core components
- [ ] Batch image processing (analyze multiple screenshots at once)
- [ ] Design token extraction from images

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
