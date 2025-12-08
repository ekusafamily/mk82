#!/bin/bash

# EKUSA Deployment Script for Ubuntu VPS with nginx
# This script builds the application and deploys it to nginx

set -e  # Exit on error

echo "🚀 Starting EKUSA deployment..."

# Configuration
BUILD_DIR="dist"
NGINX_ROOT="/var/www/ekusa"
BACKUP_DIR="/var/www/ekusa-backup"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run with sudo${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

# Create nginx root directory if it doesn't exist
if [ ! -d "$NGINX_ROOT" ]; then
    echo -e "${YELLOW}📁 Creating nginx root directory...${NC}"
    mkdir -p "$NGINX_ROOT"
fi

# Backup existing deployment
if [ -d "$NGINX_ROOT" ] && [ "$(ls -A $NGINX_ROOT)" ]; then
    echo -e "${YELLOW}💾 Backing up existing deployment...${NC}"
    rm -rf "$BACKUP_DIR"
    cp -r "$NGINX_ROOT" "$BACKUP_DIR"
fi

# Deploy new build
echo -e "${YELLOW}📤 Deploying to nginx...${NC}"
rm -rf "$NGINX_ROOT"/*
cp -r "$BUILD_DIR"/* "$NGINX_ROOT"/

# Set proper permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chown -R www-data:www-data "$NGINX_ROOT"
chmod -R 755 "$NGINX_ROOT"

# Test nginx configuration
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
nginx -t

# Reload nginx
echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
systemctl reload nginx

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Application is now live${NC}"
