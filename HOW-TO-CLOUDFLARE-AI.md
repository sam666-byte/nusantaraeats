# How to Generate Images with Cloudflare Workers AI

## API Credentials
- **Account ID:** `$CLOUDFLARE_ACCOUNT_ID` (set in environment)
- **API Token:** `$CLOUDFLARE_AI_TOKEN` (set in environment)

## Generate Single Image

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/black-forest-labs/flux-1-schnell" \
  -H "Authorization: Bearer $CLOUDFLARE_AI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Close-up food photography of [DISH NAME], [DESCRIPTION], professional food styling, clean background, 4k"}' \
  --output public/images/[slug].jpg
```

## Prompt Template
```
Close-up food photography of [DISH NAME], [DESCRIPTION], professional food styling, clean background, studio lighting, appetizing, 4k
```

## Deploy Command
```bash
cd /home/liveuser/nusantaraeats
npm run build
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID npx wrangler pages deploy out --project-name=nusantaraeats
```

## Token Scope Required
- Account → Workers AI → Edit
- Account → Workers AI Tokens → Read
