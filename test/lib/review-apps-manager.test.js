import ReviewAppManager from '../../lib/review-apps-manager.js'

describe('ReviewAppManager', () => {
  const manager = new ReviewAppManager()

  beforeEach(async () => {
    await manager.clearAll()
  })

  describe("management of keys", () => {
    it("can add and remove app names", async () => {
      await manager.addReviewAppName('foo1')
      await manager.addReviewAppName('foo2')
      await manager.removeReviewAppName('foo1')

      const reviewApps = await manager.getReviewAppNames()
      expect(reviewApps).toEqual(['foo2'])
    })
  })
})
