#!/usr/bin/env bash
# Run this ON the VPS (SSH) when https://api.garimadanceproductions.com returns 502.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Containers"
docker ps -a --filter name=gdp_ --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo ""
echo "==> Backend logs (last 60)"
docker logs gdp_backend --tail 60 2>&1 || true

echo ""
echo "==> Restarting backend"
docker compose up -d --build --force-recreate backend

echo ""
echo "==> Waiting for health..."
for i in $(seq 1 20); do
  if curl -sf "http://127.0.0.1:3041/api/health" >/tmp/gdp-health.json 2>/dev/null; then
    echo "Local health OK:"
    cat /tmp/gdp-health.json
    echo ""
    echo "Public check:"
    curl -sS -o /tmp/gdp-public.json -w "HTTP %{http_code}\n" "https://api.garimadanceproductions.com/api/health" || true
    cat /tmp/gdp-public.json 2>/dev/null || true
    echo ""
    exit 0
  fi
  echo "  attempt $i/20 — not ready yet"
  sleep 3
done

echo ""
echo "Backend still unhealthy. Common fix:"
echo "  MongoDB Atlas → Network Access → allow this VPS IP (or 0.0.0.0/0)"
echo "Then re-run: bash scripts/fix-prod-api.sh"
docker logs gdp_backend --tail 40
exit 1
