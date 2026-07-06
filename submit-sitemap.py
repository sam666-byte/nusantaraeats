#!/usr/bin/env python3
"""
Submit sitemap to Google Search Console
Uses OAuth2 credentials from client_secret.json
"""

import json
import os
import sys
from urllib.parse import urlencode
from http.server import HTTPServer, BaseHTTPRequestHandler
import webbrowser
import requests

# Config
CLIENT_SECRET_PATH = "/home/liveuser/qwencloud-generator/client_secret.json"
SITEMAP_URL = "https://nusantaraeats.com/sitemap.xml"
REDIRECT_PORT = 8085
REDIRECT_URI = f"http://localhost:{REDIRECT_PORT}/callback"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]

# Google OAuth endpoints
AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"

# Load client credentials
with open(CLIENT_SECRET_PATH) as f:
    creds = json.load(f)

client_id = creds["installed"]["client_id"]
client_secret = creds["installed"]["client_secret"]

# Store tokens
TOKEN_FILE = os.path.expanduser("~/.google_search_console_tokens.json")

class OAuthCallbackHandler(BaseHTTPRequestHandler):
    """Handle OAuth callback"""
    auth_code = None

    def do_GET(self):
        if "/callback" in self.path:
            query = self.path.split("?", 1)[1] if "?" in self.path else ""
            params = dict(p.split("=") for p in query.split("&") if "=" in p)
            OAuthCallbackHandler.auth_code = params.get("code")

            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"<h1>Authorization successful!</h1><p>You can close this window.</p>")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress logs

def get_access_token():
    """Get access token using OAuth2 flow"""
    # Check for existing tokens
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as f:
            tokens = json.load(f)

        # Try refresh token
        if "refresh_token" in tokens:
            data = {
                "client_id": client_id,
                "client_secret": client_secret,
                "refresh_token": tokens["refresh_token"],
                "grant_type": "refresh_token"
            }
            resp = requests.post(TOKEN_URL, data=data)
            if resp.status_code == 200:
                new_tokens = resp.json()
                tokens["access_token"] = new_tokens["access_token"]
                with open(TOKEN_FILE, "w") as f:
                    json.dump(tokens, f)
                return tokens["access_token"]

    # Start OAuth flow
    params = {
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }

    auth_url = f"{AUTH_URL}?{urlencode(params)}"
    print(f"\nOpening browser for authorization...")
    print(f"If browser doesn't open, visit:\n{auth_url}\n")

    # Start local server
    server = HTTPServer(("localhost", REDIRECT_PORT), OAuthCallbackHandler)
    webbrowser.open(auth_url)

    print("Waiting for authorization...")
    server.handle_request()

    if not OAuthCallbackHandler.auth_code:
        print("ERROR: No authorization code received")
        sys.exit(1)

    # Exchange code for tokens
    data = {
        "code": OAuthCallbackHandler.auth_code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    resp = requests.post(TOKEN_URL, data=data)
    if resp.status_code != 200:
        print(f"ERROR: Token exchange failed: {resp.text}")
        sys.exit(1)

    tokens = resp.json()
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f)

    return tokens["access_token"]

def submit_sitemap(access_token, site_url, sitemap_url):
    """Submit sitemap to Google Search Console"""
    # First, try to verify the site exists
    url = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}"

    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        print(f"Site {site_url} verified in Search Console")
    elif resp.status_code == 403:
        print(f"ERROR: No access to {site_url} in Search Console")
        print("Make sure the email in your Google account has access to this property")
        return False
    else:
        print(f"Site check response: {resp.status_code} - {resp.text}")
        return False

    # Submit sitemap
    url = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps"
    params = {"sitemapUrl": sitemap_url}

    resp = requests.post(url, headers=headers, params=params)

    if resp.status_code in [200, 201]:
        print(f"Sitemap submitted successfully!")
        print(f"URL: {sitemap_url}")
        return True
    else:
        print(f"ERROR submitting sitemap: {resp.status_code} - {resp.text}")
        return False

def main():
    print("=== Google Search Console Sitemap Submitter ===\n")

    # Get access token
    access_token = get_access_token()
    print("Access token obtained!\n")

    # Submit sitemap
    # Try both URL formats
    site_urls = [
        "https://nusantaraeats.com",
        "sc-domain:nusantaraeats.com"
    ]

    for site_url in site_urls:
        print(f"Trying site URL: {site_url}")
        if submit_sitemap(access_token, site_url, SITEMAP_URL):
            break

if __name__ == "__main__":
    main()
