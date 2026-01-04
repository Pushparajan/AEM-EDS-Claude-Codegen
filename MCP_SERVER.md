# AEM EDS Code Generator - MCP Server

## Model Context Protocol Server for AI-Assisted Development

This MCP server exposes the AEM EDS Code Generator functionality to AI coding assistants like Claude Desktop, Cursor, and other MCP-compatible tools.

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol that enables AI assistants to securely access external tools and data sources. It allows AI models to interact with local and remote resources through a standardized interface.

### Benefits

- 🤖 **AI-Powered Development**: Use natural language to generate AEM components
- 🔧 **Seamless Integration**: Works with Claude Desktop, Cursor, and other AI tools
- 🚀 **Productivity Boost**: Generate production-ready code through conversation
- 📦 **30+ Components**: Access the entire core component library via AI
- 🎨 **Image Analysis**: Generate components from UI descriptions

## Features

Our MCP server provides **10 powerful tools** for AEM Edge Delivery Services development:

### 1. `generate_block`
Generate custom AEM EDS blocks with JavaScript and CSS.

**Parameters:**
- `name` (required): Block name (e.g., "hero", "carousel")
- `hasButtons` (optional): Include button support
- `lazyLoad` (optional): Enable lazy loading
- `responsive` (optional): Add responsive styles

**Example:**
```
Generate a hero block with button support and lazy loading
```

### 2. `generate_component`
Generate reusable JavaScript components (functional or class-based).

**Parameters:**
- `name` (required): Component name (e.g., "Carousel", "Modal")
- `type` (optional): "functional" or "class"

**Example:**
```
Create a functional component called ImageGallery
```

### 3. `generate_template`
Generate HTML page templates with AEM EDS structure.

**Parameters:**
- `name` (required): Template name (e.g., "Landing Page")

**Example:**
```
Generate a Product Detail template
```

### 4. `list_core_component_categories`
List all available component categories.

**Example:**
```
What categories are available in the core library?
```

### 5. `list_components_by_category`
List components in a specific category.

**Parameters:**
- `category` (required): "template", "content", "container", or "form"

**Example:**
```
Show me all container components
```

### 6. `generate_core_component`
Generate production-ready components from the core library.

**Parameters:**
- `componentName` (required): Component name (e.g., "navigation", "carousel")
- `category` (optional): Component category

**Example:**
```
Generate the navigation core component
```

### 7. `generate_from_image_analysis`
Generate components from image analysis data.

**Parameters:**
- `componentName` (required): Name for the component
- `analysis` (required): Analysis object with layout, colors, typography, etc.

**Example:**
```
Generate a card component with:
- Grid layout, 3 columns
- Primary color #0066cc
- Flexbox direction row
- Hover interactions
```

### 8. `init_aem_project`
Initialize a complete AEM EDS project structure.

**Parameters:**
- `projectName` (required): Project name

**Example:**
```
Initialize a new AEM project called my-website
```

### 9. `get_component_info`
Get detailed information about a core component.

**Parameters:**
- `componentName` (required): Component name

**Example:**
```
Tell me about the accordion component
```

### 10. `search_components`
Search for components by keyword.

**Parameters:**
- `keyword` (required): Search term

**Example:**
```
Search for navigation components
```

## Installation

### Prerequisites

- Node.js >= 18.0.0
- Claude Desktop, Cursor, or another MCP-compatible AI tool

### Step 1: Install Dependencies

```bash
cd AEM-EDS-Claude-Codegen
npm install
```

This installs the MCP SDK and other dependencies.

### Step 2: Configure Your AI Tool

#### For Claude Desktop

1. Locate your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add the server configuration:

```json
{
  "mcpServers": {
    "aem-eds-codegen": {
      "command": "node",
      "args": ["/absolute/path/to/AEM-EDS-Claude-Codegen/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

3. Replace `/absolute/path/to/` with your actual path
4. Restart Claude Desktop

#### For Cursor

1. Open Cursor Settings (⌘, or Ctrl+,)
2. Search for "MCP" in settings
3. Add server configuration:

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

4. Replace `/absolute/path/to/` with your actual path
5. Restart Cursor

#### For Other MCP Tools

Refer to your tool's documentation for adding MCP servers. Generally, you'll need:

- **Command**: `node`
- **Args**: `["/path/to/AEM-EDS-Claude-Codegen/mcp-server/index.js"]`

## Usage Examples

Once configured, you can interact with the MCP server through natural language in your AI tool:

### Example 1: Generate a Block

**You:** "Generate a hero block with responsive design and button support"

**AI:** *Uses `generate_block` tool to create hero.js and hero.css files*

### Example 2: Explore Components

**You:** "What components are available in the container category?"

**AI:** *Uses `list_components_by_category` to show carousel, tabs, accordion*

### Example 3: Create from Core Library

**You:** "Generate the navigation component from the core library"

**AI:** *Uses `generate_core_component` to create production-ready navigation with accessibility*

### Example 4: Initialize Project

**You:** "Set up a new AEM EDS project called my-portfolio"

**AI:** *Uses `init_aem_project` to create complete directory structure*

### Example 5: Search Components

**You:** "Find components related to forms"

**AI:** *Uses `search_components` to find all form-related components*

## Verification

To verify the MCP server is working:

1. **Check Server Status**: The server should appear in your AI tool's MCP servers list

2. **Test a Simple Command**: Try asking:
   ```
   List all core component categories
   ```

3. **Check Logs**: The server logs to stderr, you can check for any errors

## Troubleshooting

### Server Not Appearing in AI Tool

**Solution:**
- Verify the path in configuration is absolute, not relative
- Ensure Node.js is in your PATH
- Restart the AI application completely
- Check the configuration file syntax (must be valid JSON)

### "Module not found" Errors

**Solution:**
```bash
cd AEM-EDS-Claude-Codegen
npm install
```

### Permission Denied Errors

**Solution:**
```bash
chmod +x mcp-server/index.js
```

### Server Starts But Tools Don't Work

**Solution:**
- Check that `generator.js`, `core-components.js`, and `image-analyzer.js` are in the parent directory
- Verify Node.js version is >= 18.0.0:
  ```bash
  node --version
  ```

### Generated Files Not Appearing

**Solution:**
- The MCP server returns file contents, not actual files
- Copy the returned code and save it in your project
- The AI tool should handle file creation based on the resource URIs

## Advanced Usage

### Custom Environment Variables

You can add environment variables to the MCP server configuration:

```json
{
  "mcpServers": {
    "aem-eds-codegen": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "DEBUG": "true",
        "MAX_FILE_SIZE": "10485760"
      }
    }
  }
}
```

### Running Multiple Instances

You can configure multiple instances with different settings:

```json
{
  "mcpServers": {
    "aem-eds-codegen": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"]
    },
    "aem-eds-codegen-dev": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

## Architecture

```
┌─────────────────┐
│   AI Assistant  │  (Claude Desktop, Cursor, etc.)
│                 │
└────────┬────────┘
         │ MCP Protocol
         │
┌────────▼────────┐
│   MCP Server    │  (This server)
│                 │
├─────────────────┤
│  Tool Handlers  │  - generate_block
│                 │  - generate_component
│                 │  - generate_template
│                 │  - list_categories
│                 │  - etc.
└────────┬────────┘
         │
┌────────▼────────┐
│  Code Generator │  (generator.js, core-components.js)
│                 │
└─────────────────┘
```

## Benefits Over CLI/Web App

| Feature | CLI | Web App | MCP Server |
|---------|-----|---------|------------|
| Natural Language | ❌ | ❌ | ✅ |
| AI-Assisted | ❌ | ❌ | ✅ |
| Conversational | ❌ | ❌ | ✅ |
| IDE Integration | ❌ | ❌ | ✅ |
| Context Aware | ❌ | ❌ | ✅ |
| No Browser Needed | ✅ | ❌ | ✅ |
| Offline | ✅ | Partial | ✅ |

## Related Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [AEM Edge Delivery Services Documentation](https://www.aem.live/)

## Contributing

To add new tools to the MCP server:

1. Add tool definition to `TOOLS` array
2. Create handler function
3. Add case to switch statement
4. Update documentation

Example:
```javascript
{
  name: 'my_new_tool',
  description: 'Description of what it does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Param description' }
    },
    required: ['param1']
  }
}
```

## License

MIT

## Support

For issues related to:
- **MCP Server**: Open an issue on GitHub
- **MCP Protocol**: See [MCP Documentation](https://modelcontextprotocol.io/)
- **Code Generation**: See main [README.md](../README.md)

---

**Happy AI-assisted AEM development!** 🤖✨
