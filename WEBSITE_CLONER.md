# Website Cloner - Convert Any Website to AEM EDS

> Automatically analyze and clone existing websites to AEM Edge Delivery Services

## Overview

The **Website Cloner** feature analyzes any existing website and automatically generates equivalent AEM Edge Delivery Services blocks, components, and project structure. It intelligently detects common UI patterns and maps them to appropriate AEM EDS components.

### How It Works

1. **Fetch** - Retrieves the website HTML
2. **Analyze** - Detects components using pattern matching
3. **Map** - Maps detected patterns to AEM EDS blocks
4. **Generate** - Creates complete project with blocks, templates, and documentation

---

## Detected Components

The cloner automatically identifies these common patterns:

| Pattern | Detected As | AEM Block |
|---------|-------------|-----------|
| `<header>`, `.header` | Header | `header` |
| `<nav>`, `.nav` | Navigation | `navigation` |
| `.hero`, `.banner`, `.jumbotron` | Hero Section | `hero` |
| `.card`, `.cards` | Card Grid | `cards` |
| `.carousel`, `.slider` | Carousel | `carousel` |
| `.accordion` | Accordion | `accordion` |
| `.tabs` | Tabs | `tabs` |
| `<form>` | Form | `form` |
| `.col-*`, `.column` | Columns Layout | `columns` |
| `.gallery` | Image Gallery | `gallery` |
| `.testimonial` | Testimonials | `testimonials` |
| `.cta`, `.call-to-action` | Call to Action | `cta` |
| `<footer>`, `.footer` | Footer | `footer` |

---

## Usage

### CLI

```bash
./generator.js

# Select option 7: Clone existing website 🌐
# Enter website URL: https://www.starbucksreserve.com
# Project name: starbucks-clone
# Enable Universal Editor support? (Y/n): Y
```

**Output:**
```
✓ Successfully analyzed https://www.starbucksreserve.com

Detected 8 components:

  • Header (header) - high confidence
  • Navigation (navigation) - high confidence
  • Hero Section (hero) - high confidence
  • Card Grid (cards) - medium confidence
  • Carousel (carousel) - medium confidence
  • Call to Action (cta) - medium confidence
  • Footer (footer) - high confidence

8 blocks generated
1 templates created

✓ Project created successfully at: /path/to/starbucks-clone
```

---

### MCP Server (AI Assistants)

Use natural language with Claude Desktop, Cursor, or other MCP-compatible tools:

```
"Clone https://www.starbucksreserve.com to AEM EDS"

"Analyze www.example.com and generate AEM blocks"

"Create an AEM EDS project from https://tailwindcss.com"
```

**Parameters:**
- `url` (required) - Website URL to clone
- `projectName` (optional) - Project directory name (default: "cloned-website")
- `universalEditor` (optional) - Enable Universal Editor support (default: true)

---

### API Endpoint

```javascript
POST /api/clone-website
Content-Type: application/json

{
  "url": "https://www.starbucksreserve.com",
  "projectName": "starbucks-clone",
  "universalEditor": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully analyzed https://www.starbucksreserve.com and generated 8 blocks",
  "analysis": {
    "url": "https://www.starbucksreserve.com",
    "components": [
      {
        "type": "header",
        "name": "Header",
        "confidence": "high",
        "block": "header"
      },
      // ... more components
    ],
    "metadata": {
      "title": "Starbucks Reserve",
      "description": "...",
      "hasLogo": false
    }
  },
  "project": {
    "projectName": "starbucks-clone",
    "blocks": [/* ... */],
    "templates": [/* ... */],
    "readme": "..."
  }
}
```

---

## Generated Project Structure

```
starbucks-clone/
├── blocks/
│   ├── header/
│   │   ├── header.js
│   │   └── header.css
│   ├── hero/
│   │   ├── hero.js
│   │   └── hero.css
│   ├── cards/
│   │   ├── cards.js
│   │   └── cards.css
│   ├── carousel/
│   │   ├── carousel.js
│   │   └── carousel.css
│   ├── cta/
│   │   ├── cta.js
│   │   └── cta.css
│   └── footer/
│       ├── footer.js
│       └── footer.css
├── index.html
└── README.md
```

---

## Features

### ✅ Automatic Component Detection

Intelligently identifies common UI patterns:
- Semantic HTML elements (`<header>`, `<nav>`, `<footer>`)
- Common CSS class naming conventions
- Structural patterns (grids, carousels, forms)

### ✅ Confidence Scoring

Each detected component includes a confidence level:
- **High** - Strong pattern match (semantic HTML, multiple indicators)
- **Medium** - Class-based detection
- **Low** - Weak pattern match (requires review)

### ✅ Universal Editor Support

All generated blocks include:
- `moveInstrumentation()` helper function
- Inline documentation for preserving `data-aue-*` attributes
- Best practices for DOM manipulation

### ✅ Core Component Mapping

When possible, uses pre-built core components from the AEM library instead of generating custom blocks.

### ✅ Generated Documentation

Each cloned project includes:
- Complete README with analysis results
- Component list with confidence levels
- Next steps and customization guide
- Original website metadata

---

## Examples

### Example 1: E-commerce Site

```bash
./generator.js
# Option 7: Clone existing website
# URL: https://www.apple.com
# Project: apple-clone
```

**Detected:**
- Header with navigation
- Hero section
- Product cards grid
- Carousel for product images
- Footer with links

### Example 2: Blog Site

```bash
./generator.js
# Option 7: Clone existing website
# URL: https://blog.example.com
# Project: blog-clone
```

**Detected:**
- Header
- Navigation menu
- Article cards
- Columns layout
- Footer

### Example 3: Corporate Site

Using MCP Server:
```
"Clone https://www.adobe.com to AEM EDS with project name adobe-clone"
```

**Detected:**
- Navigation
- Hero banner
- Tabbed content
- Testimonials section
- Call-to-action blocks
- Footer

---

## Limitations & Considerations

### ⚠️ What Gets Cloned

**Structure Only:**
- HTML element structure
- Component types and layout patterns
- Basic block scaffolding

**NOT Cloned:**
- Actual content (text, images)
- Exact styling and CSS
- JavaScript functionality
- Assets (images, fonts, videos)
- Third-party integrations

### ⚠️ Post-Clone Requirements

After cloning, you must:

1. **Add Content** - Replace placeholder content with actual text/images
2. **Style Blocks** - Customize CSS to match original design
3. **Implement Logic** - Add JavaScript functionality for interactions
4. **Test Thoroughly** - Verify all blocks work as expected
5. **Add Assets** - Download and include images, fonts, etc.
6. **Configure Universal Editor** - Add component models if needed

### ⚠️ Pattern Detection Accuracy

- **High confidence** - Usually accurate, review recommended
- **Medium confidence** - May need adjustment
- **Low confidence** - Definitely requires manual review

The cloner uses heuristics and pattern matching, not AI visual analysis. Results depend on:
- HTML semantic structure
- CSS class naming conventions
- DOM organization

---

## Advanced Usage

### Custom Pattern Detection

Modify `website-cloner.js` to add custom patterns:

```javascript
// Detect custom component type
if (html.match(/class=["'][^"']*my-custom-pattern[^"']*["']/i)) {
  analysis.components.push({
    type: 'custom',
    name: 'Custom Component',
    confidence: 'medium',
    block: 'custom-block',
  });
}
```

### Exclude Universal Editor

If you don't need Universal Editor support:

**CLI:**
```
Enable Universal Editor support? (Y/n): n
```

**MCP:**
```
"Clone example.com without Universal Editor support"
```

**API:**
```json
{
  "url": "https://example.com",
  "universalEditor": false
}
```

### Batch Cloning

Clone multiple pages:

```javascript
const { cloneWebsite } = require('./website-cloner');

const urls = [
  'https://example.com',
  'https://example.com/about',
  'https://example.com/contact',
];

for (const url of urls) {
  const result = await cloneWebsite(url, {
    projectName: `clone-${url.split('/').pop()}`,
  });
  console.log(result.message);
}
```

---

## Troubleshooting

### Error: Request timeout

**Cause:** Website took too long to respond

**Solution:**
- Check your internet connection
- Try again later
- Website may have rate limiting

### Error: HTTP 403/401

**Cause:** Website blocking the request

**Solution:**
- Website blocks automated requests
- May require authentication
- Try a different URL

### Error: Invalid URL format

**Cause:** URL syntax error

**Solution:**
- Ensure URL includes protocol (`https://`)
- Check for typos
- Example: `https://www.example.com`

### Few/No Components Detected

**Cause:** Website uses non-standard patterns

**Solution:**
- Review HTML structure manually
- Add custom detection patterns
- Consider manual block creation

### Wrong Component Type Detected

**Cause:** Pattern matching ambiguity

**Solution:**
- Review generated blocks
- Rename/modify as needed
- Adjust confidence levels in code

---

## Best Practices

### 1. Start with Homepage

Clone the homepage first to understand the site's primary components:
```
https://www.example.com
```

### 2. Review Before Customizing

Always review detected components before adding content:
- Check confidence levels
- Verify component types are correct
- Remove false positives

### 3. Use as Starting Point

Treat cloned output as scaffolding, not final code:
- Generated blocks are templates
- Customize for specific needs
- Add proper error handling

### 4. Combine with Other Tools

Use cloning alongside other features:
- Clone structure → Add image-to-component for specific sections
- Clone layout → Use core components for complex features

### 5. Test Incrementally

Don't customize everything at once:
1. Test one block at a time
2. Verify functionality
3. Move to next component

---

## FAQ

### Q: Can I clone sites with login requirements?

**A:** No, the cloner only accesses publicly available HTML. Sites requiring authentication won't work.

### Q: Does this violate copyright?

**A:** The cloner generates structural scaffolding only. You're responsible for:
- Not copying copyrighted content
- Respecting terms of service
- Using only for learning/inspiration

### Q: Will the clone look identical to the original?

**A:** No. Only structure is cloned. You must:
- Add styling (CSS)
- Implement functionality (JS)
- Add actual content

### Q: Can I clone dynamic/React/Vue sites?

**A:** Limited. The cloner sees server-rendered HTML only. Client-side rendered content won't be detected.

### Q: How accurate is component detection?

**A:** Depends on HTML structure:
- Semantic HTML = Higher accuracy
- Div soup = Lower accuracy
- Custom frameworks = May not detect

### Q: Can I clone my own site?

**A:** Yes! This is actually a great use case:
- Migrate existing site to AEM EDS
- Modernize old codebase
- Create AEM version of current site

---

## Real-World Example

Let's clone Starbucks Reserve:

```bash
./generator.js
# Option 7
# URL: https://www.starbucksreserve.com
# Project: starbucks-eds
# Universal Editor: Y
```

**Result:**

```
✓ Successfully analyzed https://www.starbucksreserve.com

Detected 10 components:

  • Header (header) - high confidence
  • Navigation (navigation) - high confidence
  • Hero Section (hero) - high confidence
  • Card Grid (cards) - medium confidence
  • Image Gallery (gallery) - medium confidence
  • Testimonials (testimonials) - medium confidence
  • Call to Action (cta) - medium confidence
  • Columns Layout (columns) - medium confidence
  • Footer (footer) - high confidence

✓ Project created successfully at: starbucks-eds/
```

**Next Steps:**
1. Review blocks in `starbucks-eds/blocks/`
2. Download images from original site
3. Customize CSS to match Starbucks brand colors
4. Add actual content
5. Test responsive behavior
6. Deploy to AEM EDS

---

## Integration with Other Features

### Clone + Image Analysis

1. Clone structure: `https://example.com`
2. Screenshot specific sections
3. Use Image-to-Component for detailed styling
4. Merge results

### Clone + Core Components

1. Clone detects "carousel" pattern
2. Replace with Core Component carousel
3. Get production-ready functionality

### Clone + Manual Editing

1. Clone generates base structure
2. Manually refine blocks
3. Add custom business logic
4. Fine-tune styling

---

## Contributing

To improve component detection:

1. Add patterns to `analyzeWebsiteStructure()` in `website-cloner.js`
2. Test with various websites
3. Document confidence levels
4. Submit pull request

Example contribution:

```javascript
// Detect pricing tables
if (html.match(/class=["'][^"']*pricing[^"']*["']/i) &&
    html.match(/class=["'][^"']*plan[^"']*["']/gi)?.length > 1) {
  analysis.components.push({
    type: 'pricing',
    name: 'Pricing Table',
    confidence: 'high',
    block: 'pricing',
  });
}
```

---

**Transform any website into AEM Edge Delivery Services with just a URL! 🌐**
