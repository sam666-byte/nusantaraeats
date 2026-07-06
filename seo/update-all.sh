#!/bin/bash
# NusantaraEats SEO Update Script
# Run this after adding new recipes

echo "🔄 Updating SEO assets..."

# Go to project directory
cd /home/liveuser/nusantaraeats

# Generate sitemap
echo "📍 Generating sitemap..."
node generate-sitemap-auto.js

# Generate RSS feed
echo "📡 Generating RSS feed..."
node generate-rss.js

# Generate social posts
echo "📱 Generating social media posts..."
node generate-social-posts.js

# Build
echo "🏗️ Building site..."
npm run build 2>&1 | tail -5

# Copy generated files to out
echo "📦 Copying SEO files..."
cp public/sitemap.xml out/sitemap.xml 2>/dev/null
cp public/feed.xml out/feed.xml 2>/dev/null

echo "✅ SEO update complete!"
echo ""
echo "Files updated:"
echo "  - sitemap.xml ($(grep -c '<url>' public/sitemap.xml) URLs)"
echo "  - feed.xml (50 latest recipes)"
echo "  - social-posts/ (Reddit, Pinterest, Instagram, Twitter)"
echo ""
echo "Next steps:"
echo "  1. Submit sitemap to Google Search Console"
echo "  2. Post social media content"
echo "  3. Submit to food directories"
