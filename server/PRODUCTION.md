# Production Deployment Guide

## Running as a Background Process with PM2

This guide explains how to run the Pinewood Derby server as a background process in production using PM2.

## Prerequisites

1. Build the application:
   ```bash
   npm run build
   ```

2. Set up your production environment file (`prod.env`) with necessary environment variables.

## PM2 Commands

### Start the server in background
```bash
npm run pm2:start
```

This starts the server as a daemon process that:
- Runs in the background
- Auto-restarts on crashes
- Manages logs automatically
- Survives terminal closure

### View logs
```bash
npm run pm2:logs
```

Or view specific log files:
- `logs/pm2-error.log` - Error logs only
- `logs/pm2-out.log` - Standard output
- `logs/pm2-combined.log` - All logs combined

### Check server status
```bash
npm run pm2:status
```

### Restart the server
```bash
npm run pm2:restart
```

### Stop the server
```bash
npm run pm2:stop
```

### Remove from PM2
```bash
npm run pm2:delete
```

## Configuration

The PM2 configuration is in [`ecosystem.config.js`](ecosystem.config.js):

```javascript
{
  name: 'pinewood-derby-server',
  script: 'dist/src/main.js',
  instances: 1,
  exec_mode: 'cluster',
  autorestart: true,
  max_memory_restart: '1G',
  env_production: {
    NODE_ENV: 'prod',
    PORT: 3000
  }
}
```

### Customization Options

- **instances**: Number of instances (set to `'max'` to use all CPU cores)
- **max_memory_restart**: Restart if memory exceeds this limit
- **PORT**: Change the server port
- Add more environment variables in `env_production`

## Auto-start on System Reboot

To make PM2 start automatically after a server reboot:

```bash
# Generate startup script
pm2 startup

# Save current PM2 process list
pm2 save
```

## Monitoring

### Real-time monitoring
```bash
pm2 monit
```

### Web-based monitoring (optional)
```bash
pm2 install pm2-logrotate  # Install log rotation
pm2 plus                    # PM2 Plus monitoring (requires account)
```

## Log Rotation

To prevent log files from growing too large:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Alternative: Running Without PM2

If you prefer not to use PM2, you can run the server directly:

### Using nohup (Linux/Mac)
```bash
nohup node dist/src/main.js > logs/server.log 2>&1 &
```

### Using Windows Service

For Windows production servers, consider using [node-windows](https://www.npmjs.com/package/node-windows) to create a Windows Service:

```bash
npm install -g node-windows
```

## Deployment Checklist

- [ ] Build the application: `npm run build`
- [ ] Configure `prod.env` with production settings
- [ ] Ensure database is migrated: `npm run db:migrate`
- [ ] Start with PM2: `npm run pm2:start`
- [ ] Verify server is running: `npm run pm2:status`
- [ ] Check logs: `npm run pm2:logs`
- [ ] Set up auto-restart on reboot: `pm2 startup && pm2 save`
- [ ] Configure log rotation: `pm2 install pm2-logrotate`

## Troubleshooting

### Server won't start
1. Check PM2 logs: `npm run pm2:logs`
2. Verify the build completed: check `dist/` directory
3. Check environment variables in `prod.env`
4. Ensure database is accessible

### High memory usage
- Adjust `max_memory_restart` in `ecosystem.config.js`
- Check for memory leaks in application code

### Can't see logs
- Ensure `logs/` directory exists and has write permissions
- Check PM2 log paths: `pm2 show pinewood-derby-server`

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [NestJS Production Best Practices](https://docs.nestjs.com/)
