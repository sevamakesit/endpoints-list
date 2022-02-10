import express from 'express'
import ReviewAppsManager from './lib/review-apps-manager.js'

const manager = new ReviewAppsManager()

const app = express()

app.get('/urls', async (req, res) => {
  const urls = await manager.getAllAppUrls()
  res.json(urls)
})

app.post('/review-apps/:name?', async (req, res) => {
  if (req.query.secret !== process.env.SECRET) {
    res.status(403).json({status: 'go away'})
    return
  }
  const urls = await manager.addReviewAppName(req.params.name)
  res.json({status: 'ok'})
})

app.delete('/review-apps/:name?', async (req, res) => {
  if (req.query.secret !== process.env.SECRET) {
    res.status(403).json({status: 'go away'})
    return
  }
  const urls = await manager.removeReviewAppName(req.params.name)
  res.json({status: 'ok'})
})

export default app
