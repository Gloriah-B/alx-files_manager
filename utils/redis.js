import { createClient } from 'redis';
import { promisify } from 'util';

// Class to define Redis operations
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  // Check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Get value for a given key from Redis
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  // Set key-value pair in Redis with expiration time in seconds
  async set(key, value, duration) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, duration);
  }

  // Delete a key-value pair from Redis
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
