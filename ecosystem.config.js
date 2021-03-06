const keyPath = process.env.SSH_PRIVATE_KEY_PATH || '~/.ssh/id_rsa';

module.exports = {
  apps: [
    {
      name: 'onlineDraw',
      script: 'app.js',
      args: 'start',
      env: {
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      key: keyPath,
      user: process.env.SERVER_USER,
      host: [process.env.HOST],
      ref: 'origin/master',
      repo: 'git@github.com:itashin0501/online_draw_server.git',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      path: process.env.DEPLOY_TO,
      'post-setup': 'npm install',
      'post-deploy': 'pm2 restart ~/online-draw/source/onlineDraw.config.yml --env production',
    },
  },
};
