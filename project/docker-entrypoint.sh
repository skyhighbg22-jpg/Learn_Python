#!/bin/sh
# Entrypoint script: reads environment variables and writes runtime config.json
# This allows secrets to be passed at runtime rather than embedded at build time

CONFIG_FILE="/usr/share/nginx/html/config.json"

# Create config.json with env vars (defaults to empty strings if not set)
cat > "$CONFIG_FILE" << EOF
{
  "supabase": {
    "url": "${VITE_SUPABASE_URL:-}",
    "anonKey": "${VITE_SUPABASE_ANON_KEY:-}"
  },
  "ai": {
    "groqApiKey": "${GROQ_API_KEY:-}",
    "openaiApiKey": "${OPENAI_API_KEY:-}",
    "geminiApiKey": "${GEMINI_API_KEY:-}",
    "anthropicApiKey": "${ANTHROPIC_API_KEY:-}"
  },
  "app": {
    "name": "${VITE_APP_NAME:-Learn Python}",
    "version": "${VITE_APP_VERSION:-1.0.0}"
  }
}
EOF

echo "✓ Runtime config written to $CONFIG_FILE"

# Start nginx
exec nginx -g "daemon off;"
