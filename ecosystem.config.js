module.exports = {
  apps: [
    {
      name: 'apisaga',
      script: './bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
