import ReviewAppManager from '../../lib/review-apps-manager.js'
import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

describe('ReviewAppManager', () => {
  const manager = new ReviewAppManager()

  beforeEach(async () => {
    fetch.resetMocks()
    fetch.doMock()
    await manager.clearAll()
  })

  describe("management of app names", () => {
    it("can add and remove app names", async () => {
      await manager.addReviewAppName('foo1')
      await manager.addReviewAppName('foo2')
      await manager.removeReviewAppName('foo1')

      const reviewApps = await manager.getReviewAppNames()
      expect(reviewApps).toEqual(['foo2'])
    })

    it("uses redis set, so there is no duplicates", async () => {
      await manager.addReviewAppName('foo1')
      await manager.addReviewAppName('foo1')
      await manager.addReviewAppName('foo2')

      const reviewApps = await manager.getReviewAppNames()
      expect(reviewApps.sort()).toEqual(['foo1', 'foo2'])
    })
  })

  describe("#getReviewAppUrls", () => {
    it("returns correct herokupp urls", async () => {
      await manager.addReviewAppName('test-app')
      const urls = await manager.getReviewAppUrls()
      expect(urls).toEqual(['https://test-app.herokuapp.com'])
    })
  })
})
