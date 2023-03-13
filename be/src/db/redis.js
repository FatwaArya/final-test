const redisClient = require("redis").createClient();

const redisConnection = async () => {
  try {
    await redisClient.on("connect", () => {
      console.log("Redis connection established");
    });
  } catch (error) {
    console.log("Redis", error.message);
  }
};

module.exports = { redisClient, redisConnection };
