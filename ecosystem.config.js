module.exports = {
  apps: [
    {
      name: 'apisaga',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
