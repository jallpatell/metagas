# MetaGas [ Real-Time Cross-Chain Gas Tracker ]

A modern Web3 application for tracking gas prices across Ethereum, Polygon, and Arbitrum networks in real-time.

## 🚀 Quick Deploy to Vercel

The frontend is configured for easy deployment on Vercel:

```bash
# Deploy using the provided script
./deploy.sh

# Or deploy manually
npm run build
vercel --prod
```

## 📁 Project Structure

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
├── build-frontend.js  # Frontend build script
└── deploy.sh          # Deployment automation
```

## 🛠️ Development

### Frontend (Next.js)
```bash
npm install
npm run dev
```

### Backend (Separate)
The backend is deployed separately at `wss://metagas.onrender.com/`

## 🌐 Deployment

### Frontend (Vercel)
- **Framework**: Next.js 15.4.2
- **Build Command**: `node build-frontend.js`
- **Output Directory**: `.next`
- **Runtime**: Node.js 18.x

### Backend (Render)
- **URL**: `wss://metagas.onrender.com/`
- **Protocol**: WebSocket
- **Data**: Real-time gas prices

## 🔧 Configuration

### Environment Variables
- Frontend connects to backend via WebSocket
- No additional environment variables required for frontend

### Build Process
The build script (`build-frontend.js`) automatically:
1. Temporarily moves backend files out of the way
2. Builds the frontend
3. Restores backend files
4. Ensures clean separation between frontend and backend

## 📊 Features

- **Real-time Gas Tracking**: Live gas prices for Ethereum, Polygon, and Arbitrum
- **Cross-chain Comparison**: Compare gas prices across different networks
- **Interactive Charts**: Visual representation of gas price trends
- **Order Book Integration**: Real-time market depth data
- **Responsive Design**: Works on desktop and mobile

## 🔗 API Integration

The frontend connects to the backend via WebSocket:
- **WebSocket URL**: `wss://metagas.onrender.com/`
- **Data Format**: JSON with gas prices and timestamps
- **Update Frequency**: Real-time updates

## 🚀 Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📝 License

MIT License



