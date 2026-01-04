# MCP Server Usage Examples

Real-world examples of using the AEM EDS Code Generator through AI assistants.

## Basic Block Generation

### Example 1: Simple Hero Block

**User:** "Generate a hero block"

**AI Response:**
```
I'll create a hero block for you.

[Uses generate_block tool with name="hero"]

Created hero block with:
- hero.js - Block decoration logic
- hero.css - Block styles
```

### Example 2: Feature-Rich Block

**User:** "Create a card grid block with button support, lazy loading, and responsive design"

**AI Response:**
```
I'll generate a card grid block with all those features.

[Uses generate_block tool with:
  name="card-grid"
  hasButtons=true
  lazyLoad=true
  responsive=true]

Created card-grid block with:
- Button event handlers
- IntersectionObserver for lazy loading
- Responsive media queries
```

## Component Generation

### Example 3: Functional Component

**User:** "Create a functional component called ImageLightbox"

**AI Response:**
```
I'll create a functional component for an image lightbox.

[Uses generate_component tool with:
  name="ImageLightbox"
  type="functional"]

Created ImageLightbox component with:
- Functional structure
- Init and render methods
- Public API
```

### Example 4: Class Component

**User:** "Generate a class-based Slider component"

**AI Response:**
```
I'll create a class-based Slider component.

[Uses generate_component tool with:
  name="Slider"
  type="class"]

Created Slider class with:
- Constructor and init method
- Render method
- Destroy method for cleanup
```

## Exploring Core Components

### Example 5: List Categories

**User:** "What component categories are available?"

**AI Response:**
```
[Uses list_core_component_categories tool]

Available Core Component Categories:
- template: 4 components
- content: 5 components
- container: 3 components
- form: 1 component

Total: 4 categories
```

### Example 6: Explore Category

**User:** "Show me all container components"

**AI Response:**
```
[Uses list_components_by_category tool with category="container"]

Components in "container" category:
- carousel: Image or content carousel with navigation controls
- tabs: Tabbed content interface
- accordion: Expandable accordion panels

Total: 3 components
```

### Example 7: Component Details

**User:** "Tell me about the accordion component"

**AI Response:**
```
[Uses get_component_info tool with componentName="accordion"]

Component: accordion

Category: container
Description: Expandable accordion panels

Features:
- Accessibility (ARIA labels)
- Responsive design
- Semantic HTML
- BEM CSS conventions
- Production-ready
```

## Generating from Core Library

### Example 8: Navigation Component

**User:** "Generate the navigation component from the core library"

**AI Response:**
```
[Uses generate_core_component tool with:
  componentName="navigation"]

Generated core component "navigation"

Category: template
Description: Primary site navigation with dropdown support

Files created:
- navigation.js - Full ARIA accessibility
- navigation.css - Responsive mobile menu
```

### Example 9: Carousel Component

**User:** "I need a carousel with auto-play"

**AI Response:**
```
[Uses generate_core_component tool with:
  componentName="carousel"]

Generated core component "carousel"

Category: container
Description: Image or content carousel with navigation controls

Features included:
- Auto-play with pause on hover
- Navigation buttons
- Indicators
- Touch/swipe support
- Accessible controls
```

## Image-Based Generation

### Example 10: From Description

**User:** "Generate a product card component with:
- Grid layout, 3 columns
- Primary color #FF6B6B
- Font family Inter
- Hover effects"

**AI Response:**
```
[Uses generate_from_image_analysis tool with:
  componentName="product-card"
  analysis={
    layout: { type: "grid", columns: "repeat(3, 1fr)" },
    colors: { primary: "#FF6B6B" },
    typography: { fontFamily: "Inter, sans-serif" },
    interactions: [{ type: "hover" }]
  }]

Generated component "product-card" from analysis

Files created:
- product-card.html - Structure reference
- product-card.js - With hover interactions
- product-card.css - Grid layout, Inter font
- analysis.json - For future reference
```

## Project Initialization

### Example 11: New Project

**User:** "Initialize a new AEM EDS project called portfolio-site"

**AI Response:**
```
[Uses init_aem_project tool with:
  projectName="portfolio-site"]

Initialized AEM EDS project "portfolio-site"

Directories created:
- blocks/
- components/
- templates/
- scripts/
- styles/
- icons/
- test/

Files created:
- scripts/scripts.js - Block loader
- styles/styles.css - Global styles
- package.json - Project config
```

## Searching

### Example 12: Keyword Search

**User:** "Find all navigation-related components"

**AI Response:**
```
[Uses search_components tool with:
  keyword="navigation"]

Found 3 component(s) matching "navigation":
- navigation (template): Primary site navigation with dropdown support
- breadcrumb (template): Hierarchical page navigation breadcrumb trail
- language-navigation (template): Multi-language support navigation
```

### Example 13: Feature Search

**User:** "Which components support forms?"

**AI Response:**
```
[Uses search_components tool with:
  keyword="form"]

Found 1 component(s) matching "form":
- form (form): Form container with validation, error handling, and async submission
```

## Complex Workflows

### Example 14: Multi-Step Project Setup

**User:** "Set up a new project called my-blog with a header, hero block, and card grid"

**AI Response:**
```
[Uses multiple tools in sequence:
  1. init_aem_project with projectName="my-blog"
  2. generate_core_component with componentName="navigation"
  3. generate_block with name="hero", responsive=true
  4. generate_block with name="card-grid", responsive=true]

Created complete project:

1. Project "my-blog" initialized
2. Navigation component (from core library)
3. Hero block (custom, responsive)
4. Card grid block (custom, responsive)

Your project structure:
my-blog/
  ├── blocks/
  │   ├── navigation/
  │   ├── hero/
  │   └── card-grid/
  ├── scripts/
  ├── styles/
  └── package.json
```

### Example 15: Building a Component Library

**User:** "I need all the container components for my design system"

**AI Response:**
```
[Uses generate_core_component multiple times:
  componentName="carousel"
  componentName="tabs"
  componentName="accordion"]

Generated complete container component set:

1. Carousel - Auto-play, navigation, indicators
2. Tabs - ARIA-compliant tabbed interface
3. Accordion - Expandable panels

All components include:
✅ Accessibility
✅ Responsive design
✅ Production-ready
✅ BEM CSS conventions
```

## Template Generation

### Example 16: Landing Page

**User:** "Create a landing page template"

**AI Response:**
```
[Uses generate_template tool with:
  name="Landing Page"]

Generated template "Landing Page"

File created:
- landing-page.html

Includes:
- Proper HTML5 structure
- Script and style imports
- Header/main/footer sections
```

## Advanced Usage

### Example 17: Custom Analysis Object

**User:** "Generate a pricing table component with these specs:
```json
{
  "layout": {
    "type": "grid",
    "columns": "repeat(3, 1fr)",
    "gap": "30px"
  },
  "colors": {
    "primary": "#4F46E5",
    "background": "#F9FAFB",
    "text": "#111827"
  },
  "typography": {
    "fontFamily": "Plus Jakarta Sans, sans-serif",
    "baseFontSize": "16px",
    "lineHeight": "1.6"
  },
  "interactions": [
    { "type": "hover" },
    { "type": "click" }
  ]
}
```"

**AI Response:**
```
[Uses generate_from_image_analysis tool with the provided JSON]

Generated component "pricing-table" from detailed analysis

Layout: 3-column grid
Colors: Indigo primary (#4F46E5)
Typography: Plus Jakarta Sans
Interactions: Hover + Click handlers

Files created with exact specifications!
```

## Batch Operations

### Example 18: Multiple Blocks

**User:** "Generate these blocks for me:
1. Header (with navigation)
2. Hero (with buttons and lazy load)
3. Features (responsive)
4. Footer"

**AI Response:**
```
[Uses generate_block tool 4 times with different parameters]

Generated 4 blocks:

1. ✓ header block
2. ✓ hero block (buttons + lazy load)
3. ✓ features block (responsive)
4. ✓ footer block

All blocks ready to use in your AEM EDS project!
```

## Tips for Best Results

### Be Specific

❌ "Make a component"
✅ "Generate a carousel component with auto-play"

### Use Natural Language

✅ "I need a navigation bar with dropdowns"
✅ "Create a responsive card grid"
✅ "Generate the accordion from the core library"

### Provide Context

✅ "For my e-commerce site, generate a product card with hover effects"
✅ "Create a landing page template for a SaaS product"

### Ask Questions First

✅ "What container components are available?"
✅ "Show me components related to navigation"
✅ "What features does the carousel component have?"

## Common Patterns

### Pattern 1: Explore → Select → Generate

```
1. "What categories are available?"
2. "Show me content components"
3. "Generate the teaser component"
```

### Pattern 2: Search → Info → Generate

```
1. "Search for form components"
2. "Tell me about the form component"
3. "Generate the form component"
```

### Pattern 3: Initialize → Build → Customize

```
1. "Initialize project my-app"
2. "Generate navigation and hero blocks"
3. "Create a custom modal component"
```

---

**Happy AI-assisted development!** 🚀
