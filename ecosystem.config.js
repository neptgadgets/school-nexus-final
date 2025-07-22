module.exports = {
  apps: [{
    name: 'schoolnexus',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/schoolnexus',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Process management
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    
    // Monitoring
    monitoring: false,
    
    // Advanced features
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.next'],
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Auto restart
    autorestart: true,
    
    // Merge logs
    merge_logs: true,
    
    // Log rotation
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Environment variables from file
    env_file: '.env.production'
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/schoolnexus.git',
      path: '/var/www/schoolnexus',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
