// export default {
//   apps: [
//     {
//       name: 'apisaga',
//       script: './server.js',
//       instances: 'max',
//       exec_mode: 'cluster',
//       autorestart: true,
//     },
//   ],
// }

module.exports = {
  apps: [
    {
      name: 'web-app',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
