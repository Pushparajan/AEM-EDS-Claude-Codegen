# Local Development with Netlify CLI

> Complete guide for running AEM EDS Code Generator locally with Netlify Dev

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Git**

Check your Node version:
```bash
node --version  # Should be >= 18.0.0
```

---

## Quick Start

### 1. Install Netlify CLI

```bash
# Using npm
npm install -g netlify-cli

# Using yarn
yarn global add netlify-cli

# Verify installation
netlify --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/Pushparajan/AEM-EDS-Claude-Codegen.git
cd AEM-EDS-Claude-Codegen
```

### 3. Install Dependencies

```bash
# Install project dependencies
npm install

# Install MCP server dependencies (optional, only if using MCP features)
cd mcp-server
npm install
cd ..
```

### 4. Start Netlify Dev Server

```bash
netlify dev
```

This will:
- Start local development server (usually at http://localhost:8888)
- Enable serverless functions locally
- Hot reload on file changes
- Simulate Netlify production environment

---

## Accessing the Application

Once `netlify dev` is running:

### Web Interface
```
http://localhost:8888
```

Open your browser and access:
- **Home Page**: http://localhost:8888/
- **Generator UI**: http://localhost:8888/index.html

### API Endpoints

All API endpoints are available at `/api/`:

```bash
# Generate a block
curl -X POST http://localhost:8888/api/generate-block \
  -H "Content-Type: application/json" \
  -d '{"name": "hero", "options": {"hasButtons": true}}'

# Clone a website
curl -X POST http://localhost:8888/api/clone-website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com", "projectName": "example-clone"}'

# Generate from image
curl -X POST http://localhost:8888/api/generate-from-image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@screenshot.png"

# Initialize project
curl -X POST http://localhost:8888/api/init-project \
  -H "Content-Type: application/json" \
  -d '{"projectName": "my-aem-project"}'
```

---

## CLI Usage (Alternative)

You can also use the CLI directly without the web server:

```bash
# Run the CLI generator
node generator.js

# Or if installed globally
npm link
aem-gen
```

**CLI Options:**
1. Custom Block
2. Custom Component
3. Template
4. Core Component (from library)
5. Component from Image/Screenshot 🎨
6. Initialize new project
7. Clone existing website 🌐
8. Exit

---

## Testing Features

### Test Website Cloner

**Via Web UI:**
1. Go to http://localhost:8888
2. Click "Clone Website" card
3. Enter URL: `https://www.starbucksreserve.com`
4. Click "Generate"
5. Download generated files

**Via CLI:**
```bash
node generator.js
# Select option 7: Clone existing website
# Enter URL: https://www.starbucksreserve.com
```

**Via API:**
```bash
curl -X POST http://localhost:8888/api/clone-website \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.starbucksreserve.com",
    "projectName": "starbucks-clone",
    "universalEditor": true
  }' | jq
```

### Test Block Generation

**Via Web UI:**
1. Go to http://localhost:8888
2. Click "Custom Block" card
3. Enter block name and options
4. Generate and download

**Via API:**
```bash
curl -X POST http://localhost:8888/api/generate-block \
  -H "Content-Type: application/json" \
  -d '{
    "name": "carousel",
    "options": {
      "hasButtons": true,
      "lazyLoad": true,
      "responsive": true,
      "universalEditor": true
    }
  }' | jq
```

### Test Core Components

```bash
curl http://localhost:8888/api/core-components/categories | jq

curl http://localhost:8888/api/core-components/category/content | jq

curl -X POST http://localhost:8888/api/generate-core-component \
  -H "Content-Type: application/json" \
  -d '{
    "componentName": "navigation",
    "category": "content"
  }' | jq
```

---

## Environment Variables (Optional)

Create a `.env` file in the project root:

```bash
# Copy example file
cp .env.example .env

# Edit as needed
nano .env
```

**Example `.env`:**
```bash
# Optional: AI Vision Integration (for enhanced image analysis)
# ANTHROPIC_API_KEY=sk-ant-xxxxx
# OPENAI_API_KEY=sk-xxxxx

# Optional: Analytics
# GA_TRACKING_ID=G-XXXXXXXXXX

# Optional: Custom Configuration
# MAX_FILE_SIZE=10485760
# ALLOWED_IMAGE_FORMATS=image/png,image/jpeg,image/webp
```

**Note:** The application works fully **without any environment variables**. All code generation uses built-in templates.

---

## Netlify CLI Commands

### Common Commands

```bash
# Start dev server
netlify dev

# Start on specific port
netlify dev --port 3000

# Open in browser automatically
netlify dev --open

# View functions logs
netlify functions:list
netlify functions:invoke generate-block --payload '{"name": "hero"}'

# Build for production
netlify build

# Deploy to Netlify (requires login)
netlify deploy --prod
```

### Netlify Configuration

The project uses `netlify.toml` for configuration:

```toml
[build]
  command = "npm run build"
  functions = "api"
  publish = "public"

[dev]
  command = "echo 'Dev server running'"
  port = 8888
  publish = "public"
  functions = "api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

## Project Structure

```
AEM-EDS-Claude-Codegen/
├── api/                          # Serverless functions (Netlify/Vercel)
│   ├── clone-website.js          # Website cloner endpoint
│   ├── generate-block.js         # Block generator
│   ├── generate-component.js     # Component generator
│   ├── generate-core-component.js
│   ├── generate-from-image.js
│   ├── generate-template.js
│   └── init-project.js
│
├── public/                       # Static web files
│   ├── index.html               # Web UI
│   ├── app.js                   # Frontend JavaScript
│   └── styles.css               # Styles
│
├── mcp-server/                  # MCP Server for AI assistants
│   ├── index.js
│   ├── package.json
│   └── README.md
│
├── blocks/                      # Example blocks (optional)
├── scripts/                     # Utility scripts
├── styles/                      # Global styles
│
├── generator.js                 # CLI tool (main entry)
├── website-cloner.js            # Website cloning logic
├── image-analyzer.js            # Image analysis
├── core-components.js           # Component library
│
├── netlify.toml                 # Netlify configuration
├── vercel.json                  # Vercel configuration (alternative)
├── package.json                 # Dependencies
│
└── Documentation
    ├── README.md
    ├── WEBSITE_CLONER.md
    ├── UNIVERSAL_EDITOR.md
    ├── MCP_SERVER.md
    ├── ENV_VARS.md
    ├── QUICK_START.md
    └── DEPLOYMENT.md
```

---

## Debugging

### Enable Debug Logs

```bash
# Netlify dev with debug output
netlify dev --debug

# Check function logs
netlify functions:logs
```

### Common Issues

#### Port Already in Use

```bash
# Use different port
netlify dev --port 9999
```

#### Functions Not Working

```bash
# Ensure functions directory is correct
ls -la api/

# Test function directly
netlify functions:invoke clone-website --payload '{
  "url": "https://example.com",
  "projectName": "test"
}'
```

#### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# For MCP server
cd mcp-server
rm -rf node_modules
npm install
cd ..
```

---

## Development Workflow

### 1. Make Changes

```bash
# Edit files
nano generator.js

# Changes auto-reload with netlify dev
```

### 2. Test Locally

```bash
# Start dev server (if not running)
netlify dev

# Test in browser
# http://localhost:8888

# Or test via CLI
node generator.js
```

### 3. Test API Endpoints

```bash
# Test cloning
curl -X POST http://localhost:8888/api/clone-website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.adobe.com"}'
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: your changes"
git push
```

---

## Production Deployment

### Deploy to Netlify

```bash
# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --prod
```

Or use continuous deployment:
1. Push to GitHub
2. Connect repository in Netlify dashboard
3. Auto-deploy on push to main branch

---

## Performance Tips

### 1. Function Timeout

For large website clones, increase timeout in `netlify.toml`:

```toml
[functions]
  directory = "api"
  node_bundler = "esbuild"

[functions."clone-website"]
  timeout = 30
```

### 2. Enable Caching

```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=300"
```

### 3. Optimize Dependencies

```bash
# Use production dependencies only
npm ci --production

# For development, use full install
npm install
```

---

## Using MCP Server (Optional)

The MCP server runs separately for AI assistant integration:

```bash
# Install MCP server dependencies
cd mcp-server
npm install

# Test MCP server
node index.js

# Configure in Claude Desktop
# See mcp-server/README.md for details
```

---

## Scripts Reference

```bash
# Start dev server (Netlify)
npm run dev

# Start dev server (Vercel alternative)
npm run dev:vercel

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Deploy to Netlify
npm run deploy:netlify

# Run CLI generator
npm start
# or
node generator.js
```

---

## Testing Checklist

Before deployment, test:

- [ ] Web UI loads at http://localhost:8888
- [ ] Custom block generation works
- [ ] Website cloner works with real URL
- [ ] Core component selection works
- [ ] Image upload and analysis works
- [ ] Project initialization works
- [ ] All API endpoints respond
- [ ] CLI tool works: `node generator.js`
- [ ] No console errors in browser
- [ ] Mobile responsive design works

---

## Getting Help

### Check Logs

```bash
# Netlify dev logs
netlify dev --debug

# Function-specific logs
netlify functions:logs clone-website
```

### Common Commands

```bash
# Clear Netlify cache
netlify build --clear-cache

# View site status
netlify status

# Open Netlify dashboard
netlify open:site
```

### Documentation

- **Local**: See `/docs` folder and `*.md` files
- **Netlify**: https://docs.netlify.com/cli/get-started/
- **AEM EDS**: https://www.aem.live/developer/tutorial

---

## Quick Example Session

```bash
# 1. Clone and setup
git clone https://github.com/Pushparajan/AEM-EDS-Claude-Codegen.git
cd AEM-EDS-Claude-Codegen
npm install

# 2. Start dev server
netlify dev

# 3. In another terminal, test the API
curl -X POST http://localhost:8888/api/clone-website \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.starbucksreserve.com",
    "projectName": "starbucks-test"
  }' | jq

# 4. Or use the CLI
node generator.js
# Select option 7 (Clone website)
# Enter URL: https://www.starbucksreserve.com

# 5. View generated project
ls -la starbucks-test/
```

---

**Happy coding! 🚀**

For more information, see:
- [QUICK_START.md](QUICK_START.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [WEBSITE_CLONER.md](WEBSITE_CLONER.md)
