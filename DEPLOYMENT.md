# Frontend Deployment Guide for Vercel

This guide explains how to deploy the MetaGas frontend on Vercel while keeping the backend separate.

## Project Structure

```
metagas/
├── src/
│   ├── app/           # Next.js frontend (deploy to Vercel)
│   ├── components/    # React components
│   ├── utils/         # Frontend utilities
│   └── api/           # Backend (separate deployment)
├── public/            # Static assets
├── package.json       # Frontend dependencies
├── vercel.json        # Vercel configuration
└── .gitignore         # Git ignore rules
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Backend Deployment**: Ensure your backend is deployed at `wss://metagas.onrender.com/`

## Deployment Steps

### 1. Prepare Your Repository

The repository is already configured for frontend-only deployment:
- `package.json` contains only frontend dependencies
- `vercel.json` configures the build settings
- `.gitignore` excludes backend files

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: metagas-frontend
# - Directory: ./
# - Override settings: No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Environment Variables (if needed)

If your frontend needs any environment variables, add them in the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add any required variables

### 4. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "src/app/**/*.tsx": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### package.json (Frontend Only)
- Removed backend dependencies (`express`, `redis`, `socket.io`, etc.)
- Kept only frontend dependencies
- Added `socket.io-client` for WebSocket connections

## Backend Integration

The frontend connects to your backend via WebSocket:
- **WebSocket URL**: `wss://metagas.onrender.com/`
- **Configuration**: `src/utils/websocket.ts`

## Troubleshooting

### Build Errors
1. Check that all dependencies are in `package.json`
2. Ensure TypeScript compilation passes: `npm run build`
3. Verify all imports are correct

### WebSocket Connection Issues
1. Ensure backend is running at `wss://metagas.onrender.com/`
2. Check CORS settings on backend
3. Verify WebSocket URL in `src/utils/websocket.ts`

### Performance Issues
1. Enable Vercel Analytics
2. Optimize images using Next.js Image component
3. Implement proper caching strategies

## Monitoring

1. **Vercel Analytics**: Monitor performance and errors
2. **WebSocket Connections**: Check browser console for connection status
3. **Build Logs**: Review deployment logs for any issues

## Updates

To update your deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Or manually trigger deployment from Vercel dashboard

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **WebSocket Issues**: Check browser console and backend logs
