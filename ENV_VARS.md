# Environment Variables Guide

## ⚠️ Important: No Environment Variables Required

**The AEM EDS Code Generator works completely without any environment variables.**

All features are functional out of the box:
- ✅ Custom block generation
- ✅ Custom component generation
- ✅ Template generation
- ✅ Core component library (30+ components)
- ✅ Image-to-component (with interactive analysis)
- ✅ Project initialization

You can deploy immediately to Vercel or Netlify without configuring any environment variables.

---

## Optional Environment Variables

The following variables are **optional** and only needed for specific enhancements:

### 🤖 AI Vision Integration (Future Enhancement)

If you want to add **automatic AI-powered image analysis**, you can integrate with AI vision APIs:

#### Anthropic Claude API

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get:**
1. Sign up at https://console.anthropic.com/
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

**Usage:** Automatically analyze uploaded images using Claude's vision capabilities.

#### OpenAI GPT-4 Vision API

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get:**
1. Sign up at https://platform.openai.com/
2. Go to API Keys
3. Create a new API key
4. Copy the key (starts with `sk-`)

**Usage:** Alternative to Anthropic for automatic image analysis.

---

### 📊 Analytics (Optional)

#### Google Analytics

```bash
GA_TRACKING_ID=G-XXXXXXXXXX
```

**Setup:**
1. Create a Google Analytics property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables

**Usage:** Track page views and user interactions.

#### Vercel Analytics

Automatically available when enabled in Vercel dashboard. No environment variable needed.

#### Netlify Analytics

Automatically available when enabled in Netlify dashboard. No environment variable needed.

---

### ⚙️ Custom Configuration (Optional)

#### File Upload Limits

```bash
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_IMAGE_FORMATS=image/png,image/jpeg,image/webp,image/gif
```

**Default:** 10MB, supports PNG, JPG, WebP, GIF

#### API Rate Limiting

```bash
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
```

**Default:** No rate limiting (platform handles this)

---

### 🔒 Security (Production)

#### API Access Control

```bash
API_SECRET_KEY=your-secret-key-here
```

**Usage:** Require API key for all requests (requires code modification).

#### CORS Configuration

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Default:** All origins allowed (`*`). Restrict for production.

---

## Setting Environment Variables

### Local Development

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```bash
   # Add only the variables you need
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. **Variables are automatically loaded** by Vercel Dev:
   ```bash
   npm run dev
   ```

### Vercel Deployment

#### Via Web Dashboard

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add each variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxx`
   - Environment: Production (or All)
4. Click "Save"
5. Redeploy for changes to take effect

#### Via CLI

```bash
# Add a variable
vercel env add ANTHROPIC_API_KEY production

# Pull environment variables locally
vercel env pull .env
```

### Netlify Deployment

#### Via Web Dashboard

1. Go to your site on Netlify
2. Site Settings → Build & Deploy → Environment
3. Click "Edit variables"
4. Add each variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxx`
5. Click "Save"
6. Trigger a new deploy

#### Via CLI

```bash
# Set a variable
netlify env:set ANTHROPIC_API_KEY "sk-ant-xxxxx"

# Import from .env file
netlify env:import .env

# List all variables
netlify env:list
```

---

## Environment-Specific Variables

### Production Only

Set these only in production environment:

```bash
NODE_ENV=production
ANTHROPIC_API_KEY=sk-ant-production-key
```

### Development/Preview

Set these for preview deployments:

```bash
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-development-key
```

---

## Platform Auto-Injected Variables

These are automatically set by the platform - **do not set manually:**

### Vercel

```bash
VERCEL=1
VERCEL_URL=your-app.vercel.app
VERCEL_ENV=production
VERCEL_REGION=iad1
```

### Netlify

```bash
NETLIFY=true
URL=https://your-app.netlify.app
DEPLOY_PRIME_URL=https://deploy-preview-123--your-app.netlify.app
CONTEXT=production  # or deploy-preview, branch-deploy
```

---

## Implementing AI Vision (Code Example)

If you want to add automatic AI image analysis, here's how to modify the code:

### 1. Install SDK

```bash
npm install @anthropic-ai/sdk
```

### 2. Update `api/generate-from-image.js`

```javascript
const Anthropic = require('@anthropic-ai/sdk');

// Initialize client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeImageWithAI(imageBuffer) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBuffer.toString('base64'),
            },
          },
          {
            type: 'text',
            text: 'Analyze this UI and provide JSON with layout, colors, typography, components, and interactions.'
          }
        ],
      },
    ],
  });

  return JSON.parse(response.content[0].text);
}
```

---

## Security Best Practices

### ✅ Do's

- ✅ Use `.env` for local development
- ✅ Add `.env` to `.gitignore`
- ✅ Use platform dashboards for production secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod
- ✅ Set minimum required permissions

### ❌ Don'ts

- ❌ Never commit `.env` to git
- ❌ Never hardcode API keys in code
- ❌ Never share production keys
- ❌ Never expose keys in client-side code
- ❌ Never log environment variables

---

## Troubleshooting

### Variables Not Loading

**Vercel:**
```bash
# Pull latest variables
vercel env pull

# Check if variables are set
vercel env ls
```

**Netlify:**
```bash
# Check variables
netlify env:list

# Pull variables
netlify env:pull
```

### Variables Work Locally But Not in Production

1. Check that variables are set in the platform dashboard
2. Ensure correct environment is selected (Production/Preview/Development)
3. Redeploy after adding variables
4. Check function logs for errors

### API Key Errors

```
Error: Invalid API key
```

**Solution:**
1. Verify key is correct (no extra spaces)
2. Check key is for correct environment
3. Ensure key has necessary permissions
4. Try regenerating the key

---

## Summary

| Feature | Env Vars Required | Status |
|---------|-------------------|--------|
| Basic Code Generation | None | ✅ Works out of the box |
| Core Components | None | ✅ Works out of the box |
| Image Upload | None | ✅ Works out of the box |
| Interactive Analysis | None | ✅ Works out of the box |
| AI Vision Analysis | `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` | 🔄 Future enhancement |
| Analytics | `GA_TRACKING_ID` | 🔧 Optional |
| API Security | `API_SECRET_KEY` | 🔧 Optional |

**Bottom line:** Deploy and use immediately - no configuration needed! 🚀
