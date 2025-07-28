// server/index.ts
import express from 'express'
import next from 'next'
import dotenv from 'dotenv'

dotenv.config()

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
const app = next({ dev })
const handle = app.getRequestHandler()

// Top-level await
await app.prepare()

const server = express()

// Example API route
server.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from ESModule server!' })
})

// Handle everything else (Next.js pages)
server.all('*', (req, res) => {
  return handle(req, res)
})

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
})
