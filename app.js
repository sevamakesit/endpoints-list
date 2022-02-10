import express from 'express'
import ReviewAppsManager from './review-apps-manager.js'

const manager = new ReviewAppsManager()

const app = express()

export default app
