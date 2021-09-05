const { ShardingManager } = require("discord.js"),
  manager = new ShardingManager(`./index.js`, {
    totalShards: 1, // 1 = Nenhum
    respawn: true,
  });

manager.spawn();