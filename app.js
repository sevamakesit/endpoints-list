import express from 'express'
import ReviewAppsManager from './lib/review-apps-manager.js'

const manager = new ReviewAppsManager()

const app = express()

app.get('/urls', async (req, res) => {
  const urls = await manager.getAllAppUrls()
  res.json(urls)
})

export default app
