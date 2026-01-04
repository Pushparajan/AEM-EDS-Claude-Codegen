# AEM EDS Code Generator - MCP Server

> Model Context Protocol server for AI-assisted AEM Edge Delivery Services development

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 🎯 Overview

This MCP server enables AI coding assistants (Claude Desktop, Cursor, etc.) to generate AEM Edge Delivery Services components, blocks, and templates using natural language commands.

### What is Model Context Protocol (MCP)?

MCP is an open protocol that allows AI assistants to securely access external tools and data sources through a standardized interface. This server exposes 10 powerful code generation tools to your AI assistant.

### Key Features

- 🤖 **Natural Language Code Generation** - "Generate a hero block with lazy loading"
- 📦 **30+ Core Components** - Access the complete AEM core component library
- 🎨 **Image-to-Code** - Generate components from visual analysis
- 🚀 **Project Scaffolding** - Initialize complete AEM EDS projects
- 🔍 **Component Discovery** - Search and explore available components
- ⚡ **Production-Ready** - Generated code follows AEM EDS best practices

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Available Tools](#-available-tools)
- [Configuration](#-configuration)
- [Usage Examples](#-usage-examples)
- [Troubleshooting](#-troubleshooting)
- [Development](#-development)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Claude Desktop**, **Cursor**, or another MCP-compatible AI tool

### Installation

```bash
# Install dependencies
cd mcp-server
npm install

# Verify installation
node index.js --version
```

### Configure Claude Desktop

1. **Locate your config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the MCP server** (use absolute path):

```json
{
  "mcpServers": {
    "aem-eds-codegen": {
      "command": "node",
      "args": ["/absolute/path/to/AEM-EDS-Claude-Codegen/mcp-server/index.js"]
    }
  }
}
```

3. **Restart Claude Desktop**

4. **Test it:**
   ```
   Ask Claude: "Generate a hero block with button support"
   ```

### Configure Cursor IDE

1. **Open Settings** (⌘, or Ctrl+,)
2. **Search for "MCP"**
3. **Add configuration:**

```json
{
  "mcp": {
    "servers": {
      "aem-eds-codegen": {
        "command": "node",
        "args": ["/absolute/path/to/AEM-EDS-Claude-Codegen/mcp-server/index.js"]
      }
    }
  }
}
```

4. **Restart Cursor**

---

## 🛠️ Available Tools

### 1. `generate_block`
Generate custom AEM EDS blocks with JavaScript and CSS.

**Parameters:**
- `name` (string, required) - Block name (e.g., "hero", "carousel")
- `hasButtons` (boolean) - Include button event handlers
- `lazyLoad` (boolean) - Enable IntersectionObserver lazy loading
- `responsive` (boolean) - Add responsive media queries (default: true)

**Example:**
```
"Generate a carousel block with button support and lazy loading"
```

---

### 2. `generate_component`
Generate reusable JavaScript components (functional or class-based).

**Parameters:**
- `name` (string, required) - Component name (e.g., "Modal", "Dropdown")
- `type` (string) - "functional" or "class" (default: functional)

**Example:**
```
"Create a functional component called ImageGallery"
```

---

### 3. `generate_template`
Generate HTML page templates with AEM EDS structure.

**Parameters:**
- `name` (string, required) - Template name (e.g., "Landing Page")

**Example:**
```
"Generate a Product Detail template"
```

---

### 4. `list_core_component_categories`
List all available component categories.

**Example:**
```
"What component categories are available?"
```

**Returns:** template, content, container, form

---

### 5. `list_components_by_category`
List all components in a specific category.

**Parameters:**
- `category` (string, required) - One of: template, content, container, form

**Example:**
```
"Show me all form components"
```

---

### 6. `generate_core_component`
Generate production-ready components from the core library (30+ components).

**Parameters:**
- `componentName` (string, required) - Component name (e.g., "navigation", "accordion")
- `category` (string, optional) - Component category for faster lookup

**Example:**
```
"Generate the breadcrumb core component"
```

**Available Components:**
- **Template**: Page Template, Section, Grid Layout
- **Content**: Navigation, Breadcrumb, Text, Image, Button, Title, List, Carousel, Tabs, Accordion, Teaser, Download, Experience Fragment, Content Fragment, Embed
- **Container**: Container, Accordion Container, Tabs Container, Carousel Container
- **Form**: Form Container, Form Text, Form Options, Form Button, Form Hidden

---

### 7. `generate_from_image_analysis`
Generate components from image analysis data.

**Parameters:**
- `componentName` (string, required) - Name for the generated component
- `analysis` (object, required) - Analysis data with structure:
  ```json
  {
    "layout": { "type": "grid", "columns": 3, "rows": 2 },
    "colors": { "primary": "#0066cc", "secondary": "#ffffff" },
    "typography": { "primaryFont": "Arial", "headingSize": "24px" },
    "interactions": ["hover", "click"],
    "spacing": { "padding": "20px", "margin": "16px" }
  }
  ```

**Example:**
```
"Generate a card grid component with 3 columns, primary color #0066cc, and hover effects"
```

---

### 8. `init_aem_project`
Initialize a complete AEM EDS project structure with all necessary directories and files.

**Parameters:**
- `projectName` (string, required) - Name of the project

**Example:**
```
"Initialize a new AEM project called my-website"
```

**Creates:**
```
my-website/
├── blocks/
├── components/
├── templates/
├── scripts/
├── styles/
└── README.md
```

---

### 9. `get_component_info`
Get detailed information about a specific core component.

**Parameters:**
- `componentName` (string, required) - Component name

**Example:**
```
"Tell me about the carousel component"
```

---

### 10. `search_components`
Search for components by keyword across all categories.

**Parameters:**
- `keyword` (string, required) - Search term

**Example:**
```
"Search for navigation components"
```

---

## 💬 Usage Examples

### Basic Block Generation
```
"Generate a hero block"
"Create a card grid block with buttons and responsive design"
"Make a testimonial block with lazy loading"
```

### Core Component Generation
```
"List all available component categories"
"Show me content components"
"Generate the navigation component"
"Create an accordion from the core library"
```

### Project Initialization
```
"Initialize a new AEM project called my-site"
"Set up a project structure named ecommerce-site"
```

### Component Search & Discovery
```
"Search for form components"
"What components are available for containers?"
"Tell me about the tabs component"
```

### Image-Based Generation
```
"Generate a component from this analysis: 3-column grid, blue theme, card layout"
```

### Custom Components
```
"Create a functional component called VideoPlayer"
"Generate a class-based component named DataTable"
```

### Templates
```
"Generate a Landing Page template"
"Create a Product Detail template"
```

---

## 🔧 Configuration

### Environment Variables

The MCP server works without any environment variables. All generation happens using built-in templates.

### Custom Configuration (Optional)

You can set these in your AI tool's MCP configuration:

```json
{
  "mcpServers": {
    "aem-eds-codegen": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### Server Not Appearing in AI Tool

**Problem:** MCP server not showing in Claude Desktop/Cursor

**Solutions:**
1. Verify the path is **absolute**, not relative
2. Check Node.js version: `node --version` (must be >= 18.0.0)
3. Restart your AI tool completely
4. Check config file syntax (valid JSON)
5. Look for errors in AI tool's developer console

---

### Tools Not Working

**Problem:** Tools listed but not executing

**Solutions:**
1. Verify dependencies are installed: `npm install`
2. Check file permissions: `chmod +x index.js`
3. Test server directly: `node index.js`
4. Review AI tool logs for error messages

---

### Path Issues on Windows

**Problem:** Path not recognized on Windows

**Solutions:**
1. Use forward slashes: `C:/Users/name/AEM-EDS-Claude-Codegen/mcp-server/index.js`
2. Or escape backslashes: `C:\\Users\\name\\AEM-EDS-Claude-Codegen\\mcp-server\\index.js`
3. Avoid spaces in path if possible

---

### Dependencies Not Found

**Problem:** `Cannot find module '@modelcontextprotocol/sdk'`

**Solutions:**
```bash
cd mcp-server
npm install
```

---

## 👨‍💻 Development

### Project Structure

```
mcp-server/
├── index.js                      # Main MCP server
├── package.json                  # Dependencies
├── README.md                     # This file
├── examples.md                   # Usage examples
├── claude-desktop-config.json    # Claude Desktop config template
└── cursor-config.json            # Cursor IDE config template
```

### Running the Server

**Standard mode:**
```bash
node index.js
```

**With debug logging:**
```bash
NODE_ENV=development node index.js
```

### Testing Tools

You can test the server using `mcp-inspector`:

```bash
npx @modelcontextprotocol/inspector node index.js
```

### Adding New Tools

1. Add tool definition to `TOOLS` array
2. Implement handler function
3. Add switch case in `CallToolRequestSchema` handler
4. Update documentation

---

## 📚 Additional Resources

- **Full Documentation**: [../MCP_SERVER.md](../MCP_SERVER.md)
- **Usage Examples**: [examples.md](examples.md)
- **Main Project**: [../README.md](../README.md)
- **MCP Protocol**: [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- **AEM EDS Docs**: [Adobe Experience Manager Edge Delivery Services](https://www.aem.live/)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with your AI tool
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details

---

## 🔗 Related

- **Web Application**: Use the browser-based UI at `/public/index.html`
- **CLI Tool**: Run `node generator.js` for interactive CLI
- **API Endpoints**: Deploy serverless functions for web access

---

**Made with ❤️ for AEM Edge Delivery Services developers**
