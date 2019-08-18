let test = async () => {
  const Redis = require('ioredis')

  const option = {
    port: 6379,
    host: '203.195.150.105',
    password: 'CHENSHUYE009chenshuye009'
  }

  const redis = new Redis(option)

  const keys = await redis.keys('*')

  console.log(keys)

  await redis.set('fuck', JSON.stringify({ a: 2, b: 5 }))
  let m = await redis.get('fuck')
  console.log(JSON.parse(m).a)
}

test()
