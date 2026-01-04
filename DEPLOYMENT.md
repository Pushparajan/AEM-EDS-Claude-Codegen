# Deployment Guide

The AEM EDS Code Generator can be deployed as a web application on Vercel or Netlify.

## 🌐 Web Application

The generator is available in two modes:
- **CLI Mode**: Run locally with `node generator.js`
- **Web Mode**: Hosted web application with interactive UI

## Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From the project directory
   vercel

   # For production
   npm run deploy:vercel
   # or
   vercel --prod
   ```

4. **Configure Project**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `public`
   - Install Command: `npm install`

### Vercel Configuration

The project includes `vercel.json` with the following settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ]
}
```

**API Routes:**
- `/api/generate-block` - Generate custom blocks
- `/api/generate-component` - Generate custom components
- `/api/generate-template` - Generate HTML templates
- `/api/core-components/*` - Core component library
- `/api/generate-from-image` - Image-to-component generation
- `/api/init-project` - Project initialization

## Deploy to Netlify

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)

### Manual Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   # Preview deployment
   netlify deploy

   # Production deployment
   npm run deploy:netlify
   # or
   netlify deploy --prod
   ```

### Netlify Configuration

The project includes `netlify.toml`:

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

For Netlify, you'll need to create symlinks or copy API functions to `netlify/functions`:

```bash
mkdir -p netlify/functions
cp -r api/* netlify/functions/
```

## Environment Variables

No environment variables are required for basic functionality.

For future enhancements (AI integration), add:

```bash
# .env (not committed to git)
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

## Local Development

### Start Web Server

**Using Vercel Dev:**
```bash
npm run dev
# or
vercel dev
```

Access at: `http://localhost:3000`

**Using Simple HTTP Server:**
```bash
# Python
python -m http.server 3000

# Node.js
npx http-server public -p 3000
```

### Test API Endpoints

```bash
curl -X POST http://localhost:3000/api/generate-block \
  -H "Content-Type: application/json" \
  -d '{"name":"hero","options":{"hasButtons":true}}'
```

## Project Structure

```
AEM-EDS-Claude-Codegen/
├── public/                 # Static web files
│   ├── index.html         # Main UI
│   ├── styles.css         # Styling
│   └── app.js             # Frontend logic
├── api/                   # Serverless API functions
│   ├── generate-block.js
│   ├── generate-component.js
│   ├── generate-template.js
│   ├── generate-core-component.js
│   ├── generate-from-image.js
│   ├── init-project.js
│   └── core-components/
│       ├── categories.js
│       └── category/[category].js
├── generator.js           # CLI application
├── core-components.js     # Component library
├── image-analyzer.js      # Image analysis module
├── vercel.json           # Vercel configuration
├── netlify.toml          # Netlify configuration
└── package.json          # Dependencies

```

## Features in Web App

### ✅ Implemented
- Custom Block Generator
- Custom Component Generator
- Template Generator
- Core Component Library (30+ components)
- Image-to-Component Generation
- Project Initialization
- File Download (single/multiple files)
- Responsive Design
- Interactive UI

### 🔄 Backend API
- RESTful API endpoints
- Serverless functions
- CORS enabled
- Error handling
- JSON responses

## Troubleshooting

### Vercel Issues

**Problem:** API routes not working
```bash
# Solution: Check vercel.json routes configuration
# Ensure all API files are in /api directory
```

**Problem:** Build fails
```bash
# Solution: Check Node.js version
vercel --version
node --version  # Should be >= 14.0.0
```

### Netlify Issues

**Problem:** Functions not deploying
```bash
# Solution: Copy API functions to netlify/functions
mkdir -p netlify/functions
cp -r api/* netlify/functions/
```

**Problem:** Redirects not working
```bash
# Solution: Check netlify.toml redirects
# Ensure [[redirects]] is properly configured
```

### General Issues

**Problem:** CORS errors in browser
```bash
# Solution: Check API response headers
# All API endpoints should include:
Access-Control-Allow-Origin: *
```

**Problem:** Image upload fails
```bash
# Solution: Check multiparty dependency
npm install multiparty
```

## Performance Optimization

### Vercel
- Edge caching for static files
- Serverless function caching
- Automatic compression
- CDN distribution

### Netlify
- Global CDN
- Asset optimization
- Form handling
- Split testing support

## Security

### Best Practices
- No sensitive data in frontend
- API rate limiting (configured on platform)
- Input validation on all endpoints
- Sanitized file downloads
- HTTPS enforced

## Monitoring

### Vercel Analytics
```bash
# Enable in Vercel dashboard
Project Settings → Analytics → Enable
```

### Netlify Analytics
```bash
# Enable in Netlify dashboard
Site Settings → Analytics → Enable
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS or use Netlify DNS

## Cost

Both platforms offer generous free tiers:

**Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions: 100 GB-Hrs

**Netlify Free Tier:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Netlify: https://answers.netlify.com/

For code issues:
- GitHub Issues: https://github.com/Pushparajan/AEM-EDS-Claude-Codegen/issues

## Updates

To update your deployment:

```bash
# Pull latest changes
git pull origin main

# Redeploy
vercel --prod
# or
netlify deploy --prod
```

Auto-deployment is available:
- **Vercel**: Connect GitHub repo for auto-deploy on push
- **Netlify**: Enable continuous deployment in settings
