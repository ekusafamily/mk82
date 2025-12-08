# EKUSA VPS Deployment Guide

Complete guide for deploying EKUSA to an Ubuntu VPS with nginx.

## Prerequisites

- Ubuntu VPS (20.04 LTS or later)
- Root or sudo access
- Domain name (optional but recommended)

## Initial Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js and npm
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Application Deployment

### 1. Clone or Upload Project
```bash
# If using git
cd /var/www
sudo git clone <your-repo-url> ekusa-app
cd ekusa-app

# Or upload files via SCP/SFTP
```

### 2. Create Environment File
```bash
# Create .env file with your Supabase credentials
sudo nano .env
```

Add:
```env
VITE_SUPABASE_PROJECT_ID="qmtakzxwkbcmglisqcow"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdGFrenh3a2JjbWdsaXNxY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjY1NzcsImV4cCI6MjA3MzQ0MjU3N30.Yi2rC4_TbFGO1Gb0F0_rrKpl37j4tqYey6-RccoDkP8"
VITE_SUPABASE_URL="https://qmtakzxwkbcmglisqcow.supabase.co"
```

### 3. Configure nginx
```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/ekusa

# Edit the configuration to set your domain/IP
sudo nano /etc/nginx/sites-available/ekusa

# Enable the site
sudo ln -s /etc/nginx/sites-available/ekusa /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Deploy Application
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

## SSL Setup (Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL Certificate
```bash
# Replace with your domain
sudo certbot --nginx -d ekusa.example.com

# Follow the prompts
# Certbot will automatically configure nginx for HTTPS
```

### Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
```

## Automated Deployment with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USERNAME }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/ekusa-app
          git pull origin main
          sudo ./deploy.sh
```

Add these secrets to your GitHub repository:
- `VPS_HOST`: Your VPS IP address
- `VPS_USERNAME`: SSH username (usually root or ubuntu)
- `VPS_SSH_KEY`: Your private SSH key

## Maintenance Commands

### View nginx logs
```bash
sudo tail -f /var/log/nginx/ekusa-access.log
sudo tail -f /var/log/nginx/ekusa-error.log
```

### Restart nginx
```bash
sudo systemctl restart nginx
```

### Check nginx status
```bash
sudo systemctl status nginx
```

### Rollback deployment
```bash
sudo rm -rf /var/www/ekusa/*
sudo cp -r /var/www/ekusa-backup/* /var/www/ekusa/
sudo systemctl reload nginx
```

### Update application
```bash
cd /var/www/ekusa-app
git pull origin main
sudo ./deploy.sh
```

## Troubleshooting

### Application not loading
1. Check nginx logs: `sudo tail -f /var/log/nginx/ekusa-error.log`
2. Verify nginx is running: `sudo systemctl status nginx`
3. Check file permissions: `ls -la /var/www/ekusa`

### 502 Bad Gateway
1. Ensure build was successful
2. Check nginx configuration: `sudo nginx -t`
3. Verify files exist in `/var/www/ekusa`

### Routes not working (404 on refresh)
- Ensure `try_files $uri $uri/ /index.html;` is in nginx config

## Performance Optimization

### Enable HTTP/2
Already configured in the nginx SSL block.

### Browser Caching
Already configured for static assets (1 year cache).

### Gzip Compression
Already enabled in nginx config.

### Monitor Performance
```bash
# Install and configure monitoring tools
sudo apt install htop -y
```

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Firewall configured (ufw)
- [ ] Regular system updates scheduled
- [ ] Secure admin credentials
- [ ] Environment variables secured
- [ ] Regular backups configured
- [ ] Security headers configured in nginx
- [ ] Keep Node.js and npm updated

## Support

For issues or questions, contact the EKUSA technical team.
