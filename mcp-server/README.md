# AEM EDS Code Generator MCP Server

Connect your AI coding assistant to the AEM Edge Delivery Services Code Generator using the Model Context Protocol.

## Quick Start

### 1. Install

```bash
cd ../
npm install
```

### 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### 3. Restart Claude Desktop

### 4. Try It Out

Ask Claude:
> "Generate a hero block with button support and lazy loading"

## Available Tools

- `generate_block` - Create custom blocks
- `generate_component` - Create components
- `generate_template` - Create templates
- `list_core_component_categories` - List categories
- `list_components_by_category` - List components
- `generate_core_component` - Generate from library
- `generate_from_image_analysis` - Generate from analysis
- `init_aem_project` - Initialize project
- `get_component_info` - Get component details
- `search_components` - Search components

## Documentation

See [MCP_SERVER.md](../MCP_SERVER.md) for complete documentation.

## Examples

```
"List all core component categories"
"Generate the navigation component"
"Create a carousel block with lazy loading"
"Initialize a new project called my-site"
"Search for form components"
```

## Troubleshooting

- Ensure path is absolute
- Restart Claude Desktop after configuration
- Check Node.js version >= 18.0.0

## License

MIT
