module.exports = {
  apps: [
    {
      name: "forsa-shop",
      script: "server/dist/index.js",
      cwd: "/var/www/forsa-shop",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/forsa-shop-error.log",
      out_file: "/var/log/pm2/forsa-shop-out.log",
      log_file: "/var/log/pm2/forsa-shop-combined.log",
      time: true,
    },
  ],
};
