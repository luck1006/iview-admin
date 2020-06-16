const puppeteer = require('puppeteer')
const genericPool = require('generic-pool')
const initDebug = require('debug')

const debug = initDebug('puppeteer-pool')

const initPuppeteerPool = ({
  max = 8,
  // optional. if you set this, make sure to drain() (see step 3)
  min = 1,
  // specifies how long a resource can stay idle in pool before being removed
  idleTimeoutMillis = 30000,
  // specifies the maximum number of times a resource can be reused before being destroyed
  maxUses = 50,
  testOnBorrow = true,
  puppeteerArgs = {},
  validator = () => Promise.resolve(true),
  ...otherConfig
} = {}) => {
  debug('init puppeteer pool')
  // TODO: randomly destroy old instances to avoid resource leak?
  const factory = {
    create: () =>
      puppeteer.launch(puppeteerArgs)
        .then(instance => {
          instance.useCount = 0
          return instance
        }),
    destroy: instance => {
      instance.close()
    },
    validate: instance =>
      validator().then(valid =>
        Promise.resolve(
          valid && (maxUses <= 0 || instance.useCount < maxUses)
        )
      )
  }
  const config = {
    max,
    min,
    idleTimeoutMillis,
    testOnBorrow,
    ...otherConfig
  }
  const pool = genericPool.createPool(factory, config)
  const genericAcquire = pool.acquire.bind(pool)
  pool.acquire = () =>
    genericAcquire().then(instance => {
      instance.useCount += 1
      return instance
    })
  pool.use = fn => {
    let resource
    return pool
      .acquire()
      .then(r => {
        resource = r
        return resource
      })
      .then(fn)
      .then(
        result => {
          pool.release(resource)
          return result
        },
        err => {
          pool.release(resource)
          throw err
        }
      )
  }

  return pool
}

const pool = initPuppeteerPool({
  puppeteerArgs: {
    headless: true,
    slowMo: 250,
    args: ['--no-sandbox']
  }
})

process.on('beforeExit', () => {
  // Destroying the pool:
  pool.drain().then(() => pool.clear())
})

module.exports = pool
