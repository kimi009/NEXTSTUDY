function getRedisSessionId(sid) {
  return `ssid:${sid}`
}

class RedisSessionStore {
  constructor(client) {
    this.client = client
  }

  //获取redis里面存储的session数据
  async get(sid) {
    // console.log(13, sid)
    const id = getRedisSessionId(sid)
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    } catch (err) {
      console.error(err)
      return null
    }
  }

  //存储session数据到redis
  //ttl是到达这个时间自动从redis里面删除
  async set(sid, session, ttl) {
    // console.log(sid, ttl)
    //ttl  经过多少时间过期
    const id = getRedisSessionId(sid)
    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }
    try {
      const sessionStr = JSON.stringify(session)
      if (ttl) {
        await this.client.setex(id, ttl, sessionStr)
      } else {
        await this.client.set(id, sessionStr)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //从redis中删除某个session
  async destroy(sid) {
    const id = getRedisSessionId(sid)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore
