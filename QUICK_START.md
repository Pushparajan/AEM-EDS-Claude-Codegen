# Quick Start Guide

## ⚡ TL;DR - Environment Variables

**NO ENVIRONMENT VARIABLES REQUIRED!** 🎉

The AEM EDS Code Generator works completely out of the box. Deploy now, configure later (if needed).

---

## 🚀 Deploy in 30 Seconds

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Or click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or click: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Pushparajan/AEM-EDS-Claude-Codegen)

**That's it!** Your app is live and fully functional.

---

## ✅ What Works Without Configuration

- ✅ Custom block generation
- ✅ Custom component generation
- ✅ Template generation
- ✅ 30+ core components library
- ✅ Image upload and preview
- ✅ Interactive image analysis
- ✅ Project initialization
- ✅ File downloads

**Everything works immediately after deployment.**

---

## 🔧 Optional: Future Enhancements

If you want to add **automatic AI-powered image analysis**, add these later:

```bash
# In Vercel/Netlify dashboard → Environment Variables
ANTHROPIC_API_KEY=sk-ant-xxxxx  # For Claude Vision
# or
OPENAI_API_KEY=sk-xxxxx  # For GPT-4 Vision
```

**But you don't need this to start!** The app uses interactive analysis by default.

---

## 📚 Documentation

- **ENV_VARS.md** - Complete guide to all optional environment variables
- **.env.example** - Template file with all available options
- **DEPLOYMENT.md** - Comprehensive deployment guide
- **README.md** - Full documentation

---

## 🎯 Summary

| Question | Answer |
|----------|--------|
| Do I need environment variables? | **NO** |
| Will the app work without them? | **YES** |
| Can I deploy immediately? | **YES** |
| What features work out of the box? | **ALL OF THEM** |
| When do I need env vars? | Only for optional AI vision API integration |
| Where do I set them if needed? | Vercel/Netlify dashboard → Environment Variables |

---

**Start building AEM components now!** 🚀
