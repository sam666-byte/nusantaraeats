#!/usr/bin/env python3
"""
NusantaraEats Favicon Generator & Server
Generate favicons in multiple sizes and serve them via Python HTTP server
"""

import http.server
import socketserver
import json
import os
import sys
from pathlib import Path
from io import BytesIO

# Try to import PIL, install if not available
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    os.system("pip3 install Pillow")
    from PIL import Image, ImageDraw, ImageFont

# ============================================
# CONFIG
# ============================================
PORT = 8888
OUTPUT_DIR = Path("./public/favicons")
WEBSITE_URL = "https://nusantaraeats.com"

# ============================================
# GENERATE FAVICON
# ============================================
def create_favicon(size, bg_color="#111111", text_color="#F59E0B"):
    """Create a favicon with NE logo"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw circle background
    padding = int(size * 0.05)
    draw.ellipse(
        [padding, padding, size - padding, size - padding],
        fill=bg_color,
        outline=text_color,
        width=max(2, int(size * 0.03))
    )

    # Draw "NE" text
    font_size = int(size * 0.35)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = "NE"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.02)

    draw.text((x, y), text, fill=text_color, font=font)

    return img

def generate_all_favicons():
    """Generate favicons in all required sizes"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
        "favicon.ico": 64,
    }

    print("🍳 Generating NusantaraEats favicons...")

    for filename, size in sizes.items():
        img = create_favicon(size)
        filepath = OUTPUT_DIR / filename

        if filename.endswith(".ico"):
            # ICO format needs special handling
            img_ico = img.resize((64, 64), Image.Resampling.LANCZOS)
            img_ico.save(filepath, format="ICO", sizes=[(64, 64)])
        else:
            img.save(filepath, "PNG")

        print(f"  ✅ {filename} ({size}x{size})")

    # Generate SVG version
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F59E0B"/>
      <stop offset="50%" style="stop-color:#D97706"/>
      <stop offset="100%" style="stop-color:#B45309"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="#111111" stroke="url(#gold)" stroke-width="3"/>
  <text x="50" y="62" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="url(#gold)" text-anchor="middle">NE</text>
</svg>'''

    svg_path = OUTPUT_DIR / "favicon.svg"
    svg_path.write_text(svg_content)
    print(f"  ✅ favicon.svg (vector)")

    print(f"\n📁 All favicons saved to: {OUTPUT_DIR}")
    return True

# ============================================
# HTML HEAD TAGS
# ============================================
def print_html_tags():
    """Print HTML tags to add to website"""
    print("\n📋 Add these tags to your <head> section:")
    print("=" * 60)
    print('''
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#111111">
    ''')
    print("=" * 60)

# ============================================
# PYTHON HTTP SERVER
# ============================================
class FaviconHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(OUTPUT_DIR), **kwargs)

    def do_GET(self):
        # Add CORS headers
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, max-age=31536000")

        if self.path.endswith(".svg"):
            self.send_header("Content-Type", "image/svg+xml")
        elif self.path.endswith(".ico"):
            self.send_header("Content-Type", "image/x-icon")
        elif self.path.endswith(".png"):
            self.send_header("Content-Type", "image/png")
        else:
            self.send_header("Content-Type", "application/octet-stream")

        self.end_headers()

        # Serve the file
        file_path = OUTPUT_DIR / self.path.lstrip("/")
        if file_path.exists():
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())

    def log_message(self, format, *args):
        print(f"[Favicon Server] {args[0]}")

def start_server():
    """Start Python HTTP server for favicons"""
    with socketserver.TCPServer(("", PORT), FaviconHandler) as httpd:
        print(f"\n🚀 Favicon Server running at:")
        print(f"   http://localhost:{PORT}")
        print(f"\n📌 Favicon URLs:")
        print(f"   SVG: http://localhost:{PORT}/favicon.svg")
        print(f"   ICO: http://localhost:{PORT}/favicon.ico")
        print(f"   PNG: http://localhost:{PORT}/favicon-32x32.png")
        print(f"\nPress Ctrl+C to stop")
        httpd.serve_forever()

# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    print("=" * 60)
    print("🍳 NusantaraEats Favicon Generator & Server")
    print("=" * 60)

    # Generate favicons
    generate_all_favicons()

    # Print HTML tags
    print_html_tags()

    # Ask what to do
    print("\nChoose an option:")
    print("1. Start favicon server (preview)")
    print("2. Just generate favicons")
    print("3. Exit")

    choice = input("\nEnter choice (1-3): ").strip()

    if choice == "1":
        start_server()
    elif choice == "2":
        print("\n✅ Favicons generated! Add the HTML tags to your website.")
    else:
        print("\n👋 Goodbye!")
