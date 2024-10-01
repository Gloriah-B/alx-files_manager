import { createClient } from 'redis';
import { promisify } from 'util';

// Class to define methods for commonly used Redis commands
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  // Check connection status and report
  isAlive() {
    return this.client.connected;
  }

  // Get value for a given key from Redis server
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  // Set key-value pair to Redis server with expiration time
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  // Delete key-value pair from Redis server
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

// Export the Redis client instance
const redisClient = new RedisClient();

module.exports = redisClient;
