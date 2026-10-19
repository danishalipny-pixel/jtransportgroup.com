#!/bin/bash
set -e

echo "=================================================="
echo "  J TRANSPORT GROUP - AUTOMATED VPS DEPLOYMENT   "
echo "=================================================="

# 1. System packages
echo "[1/6] Installing PM2, Nginx, Certbot..."
sudo apt update -y
sudo apt install -y nginx certbot python3-certbot-nginx git curl
sudo npm install -g pm2

# 2. Directory & Repo
echo "[2/6] Preparing /var/www/jtransportgroup and pulling GitHub code..."
sudo mkdir -p /var/www/jtransportgroup
sudo chown -R $USER:$USER /var/www/jtransportgroup
cd /var/www/jtransportgroup

if [ ! -d ".git" ]; then
  git clone https://github.com/danishalipny-pixel/J-TransportGroup.git .
else
  git fetch origin main
  git reset --hard origin/main
fi

git checkout main

# 3. Dependencies & Data dir
echo "[3/6] Installing production dependencies via npm ci..."
npm ci --only=production
mkdir -p data

# 4. Environment File (.env) check
if [ ! -f ".env" ]; then
  echo "[4/6] Creating default production .env template..."
  cat << "EOF" > .env
PORT=8080
APP_BASE_URL=https://jtransportgroup.com
JWT_SECRET=jtransport_secure_jwt_secret_2026
DATABASE_PATH=/var/www/jtransportgroup/data/mlt.db

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jtransportgroup.ltd@gmail.com
SMTP_PASS=
COMPANY_EMAIL=info@jtransportgroup.com
EOF
  echo "    --> Created .env template at /var/www/jtransportgroup/.env"
fi

# 5. PM2 Start & Persistence
echo "[5/6] Starting backend application with PM2..."
pm2 start server.js --name "jtransport-backend" || pm2 restart "jtransport-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER || true

# 6. Nginx Configuration
echo "[6/6] Configuring Nginx reverse proxy to 127.0.0.1:8080..."
sudo bash -c 'cat << "EOF" > /etc/nginx/sites-available/jtransportgroup.com
server {
    listen 80;
    server_name jtransportgroup.com www.jtransportgroup.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
EOF'

sudo ln -sf /etc/nginx/sites-available/jtransportgroup.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. SSL Certificate Setup
echo "Configuring HTTPS SSL with Let's Encrypt Certbot..."
sudo certbot --nginx -d jtransportgroup.com -d www.jtransportgroup.com --non-interactive --agree-tos --email jtransportgroup.ltd@gmail.com || true

echo "=================================================="
echo "      DEPLOYMENT SUCCESSFUL! HEALTH CHECK:        "
echo "=================================================="
curl -s http://127.0.0.1:8080/api/health
echo ""
