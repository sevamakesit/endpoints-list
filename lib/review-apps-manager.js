import { createClient } from 'redis'
import fetch from 'node-fetch'

const REVIEW_APPS_KEY = 'HEROKU_REVIEW_APPS';
const { APP_URLS_URL } = process.env

class ReviewAppsManager {
  constructor() {
    this._redis = null
  }

  async addReviewAppName(herokuAppName) {
    const redis = await this._getRedisInstance()
    await redis.sAdd(REVIEW_APPS_KEY, herokuAppName)

    return true
  }

  async removeReviewAppName(herokuAppName) {
    const redis = await this._getRedisInstance()
    await redis.sRem(REVIEW_APPS_KEY, herokuAppName)

    return true
  }

  async getReviewAppNames() {
    const redis = await this._getRedisInstance()
    const appNames = await redis.sMembers(REVIEW_APPS_KEY)

    return appNames
  }

  async clearAll() {
    const redis = await this._getRedisInstance()
    await redis.del(REVIEW_APPS_KEY)

    return true
  }

  async getReviewAppUrls() {
    const appNames = await this.getReviewAppNames()
    return appNames.map(this._appNameToUrl)
  }

  async getBaseAppUrls() {
    const response = await fetch(APP_URLS_URL)
    const json = await response.json()

    return json
  }

  async getAllAppUrls() {
    const reviewAppUrls = await this.getReviewAppUrls()
    const baseAppUrls = await this.getBaseAppUrls()

    return [...reviewAppUrls, ...baseAppUrls]
  }

  _appNameToUrl(appName) {
    return `https://${appName}.herokuapp.com`
  }

  async _getRedisInstance() {
    if (this._redis) { return this._redis }

    const redis = createClient({url: process.env.REDIS_URL})
    redis.on('error', (err) => console.error("Redis error", err))

    await redis.connect()

    this._redis = redis;
    return this._redis;
  }
}

export default ReviewAppsManager
