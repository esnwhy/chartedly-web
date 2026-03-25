#!/bin/bash
# ============================================
# Chartedly VPS Setup Script
# Run this on your Hostinger VPS (76.13.223.243)
# ============================================

set -e

echo "🚀 Setting up Chartedly on VPS..."

# 1. Install Node.js 20 if not present
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "✅ Node.js $(node -v)"

# 2. Install Python3 + pip + rembg dependencies
echo "📦 Installing Python dependencies..."
apt-get update -qq
apt-get install -y python3 python3-pip python3-venv git -qq

# 3. Clone Chartedly repo (or update if exists)
CHARTEDLY_DIR="/opt/chartedly"
if [ -d "$CHARTEDLY_DIR" ]; then
  echo "📂 Chartedly directory exists, pulling latest..."
  cd "$CHARTEDLY_DIR" && git pull origin main
else
  echo "📂 Cloning Chartedly..."
  # Replace with your actual GitHub repo URL
  echo "⚠️  Please clone your repo manually:"
  echo "  git clone https://github.com/YOUR_USERNAME/chartedly-web.git /opt/chartedly"
  echo "  Then re-run this script."
  mkdir -p "$CHARTEDLY_DIR"
fi

cd "$CHARTEDLY_DIR"

# 4. Install npm dependencies
if [ -f "package.json" ]; then
  echo "📦 Installing npm dependencies..."
  npm ci --production=false
fi

# 5. Install Python packages for image processing
echo "📦 Installing Python packages (rembg, Pillow)..."
pip3 install "rembg[cpu]" Pillow --break-system-packages 2>/dev/null || pip3 install "rembg[cpu]" Pillow

# 6. Create environment file
ENV_FILE="/opt/chartedly/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "📝 Creating .env file (fill in your keys!)..."
  cat > "$ENV_FILE" << 'ENVEOF'
# Rakuten API
RAKUTEN_APP_ID=c6fa6ed2-114f-4025-bf99-3ac4a17d44d0
RAKUTEN_ACCESS_KEY=pk_HlDOZRpiz5L7Zns0y04QYD5RlJf9721qEbJd166GmYK
RAKUTEN_AFFILIATE_ID=520a0491.97d8289b.520a0492.f21fca06

# Anthropic (Claude API)
ANTHROPIC_API_KEY=YOUR_KEY_HERE

# Timezone
TZ=Asia/Tokyo
ENVEOF
  echo "⚠️  Edit /opt/chartedly/.env and add your ANTHROPIC_API_KEY!"
fi

# 7. Set up git config for automated commits
cd "$CHARTEDLY_DIR"
git config user.name "Chartedly Bot"
git config user.email "bot@chartedly.com"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  ✅ Chartedly VPS Setup Complete!            ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Directory: /opt/chartedly                   ║"
echo "║  Node.js:   $(node -v)                       ║"
echo "║  Python:    $(python3 --version)             ║"
echo "║                                              ║"
echo "║  Next steps:                                 ║"
echo "║  1. Clone your GitHub repo to /opt/chartedly ║"
echo "║  2. Edit .env with your API keys             ║"
echo "║  3. Import n8n workflow via browser           ║"
echo "╚══════════════════════════════════════════════╝"
