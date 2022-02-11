import express from 'express'
import basicAuth from 'express-basic-auth'
import ReviewAppsManager from './lib/review-apps-manager.js'

const manager = new ReviewAppsManager()

const app = express()

app.use(basicAuth({
  users: { 'zipline_device': process.env.SECRET }
}))

app.get('/urls', async (req, res) => {
  const urls = await manager.getAllAppUrls()
  res.json(urls)
})

app.post('/review-apps/:name?', async (req, res) => {
  const urls = await manager.addReviewAppName(req.params.name)
  res.json({status: 'ok'})
})

app.delete('/review-apps/:name?', async (req, res) => {
  const urls = await manager.removeReviewAppName(req.params.name)
  res.json({status: 'ok'})
})

export default app
