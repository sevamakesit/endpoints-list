import { createClient } from 'redis'

const REVIEW_APPS_KEY = 'HEROKU_REVIEW_APPS';

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
    const appNames = await getReviewAppNames()
    return appNames.map(this._appNameToUrl)
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
