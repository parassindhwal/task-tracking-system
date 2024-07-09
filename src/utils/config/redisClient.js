const redis = require('redis');
const { promisify } = require('util');

let client;

function getClient() {
  if (!client) {
    client = redis.createClient();
    client.on('error', (err) => {
      console.error('Redis error: ', err);
    });
    client.on('connect', () => {
      console.log('Connected to Redis');
    });

    // Promisify Redis client methods for async usage
    client.getAsync = promisify(client.get).bind(client);
    client.setAsync = promisify(client.set).bind(client);
  }

  return client;
}

module.exports = getClient;
