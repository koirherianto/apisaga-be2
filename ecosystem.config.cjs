module.exports = {
  apps: [
    {
      name: 'apisaga',
      script: './bin/server.ts',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      interpreter: 'node',
    },
  ],
}
