#!/usr/bin/env bash
#
# Build a fully static HTML/CSS/JS export of the PYRGOS AFC site into `out/`.
#
# The locale proxy and the POST /api/contact route cannot run in a static
# export, so this script temporarily removes the API route for the build and
# writes a small root redirect that sends visitors to their language.
#
set -euo pipefail
cd "$(dirname "$0")/.."

API_DIR="src/app/api"
STASH_DIR=".api-export-stash"

restore_api() {
  if [ -d "$STASH_DIR" ]; then
    rm -rf "$API_DIR"
    mv "$STASH_DIR" "$API_DIR"
  fi
}
trap restore_api EXIT

# Move the Request-based API route out of the way (unsupported when exporting).
if [ -d "$API_DIR" ]; then
  rm -rf "$STASH_DIR"
  mv "$API_DIR" "$STASH_DIR"
fi

echo "▸ Building static export…"
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_EXPORT=1 npx next build

# Root redirect: the proxy no longer runs, so send "/" straight to Greek —
# the club's primary language and the main-domain landing.
echo "▸ Writing root redirect to Greek…"
cat > out/index.html <<'HTML'
<!doctype html>
<html lang="el">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PYRGOS AFC</title>
    <script>
      window.location.replace("./el/");
    </script>
    <meta http-equiv="refresh" content="0; url=./el/" />
    <style>
      html,body{height:100%;margin:0;background:#0d0405;color:#f3f5fc;
        font-family:ui-sans-serif,system-ui,sans-serif;display:grid;place-items:center}
      a{color:#ef5347}
    </style>
  </head>
  <body>
    <p>Ανακατεύθυνση… / Redirecting… &nbsp;<a href="./el/">PYRGOS AFC</a></p>
  </body>
</html>
HTML

echo "▸ Packaging zip…"
rm -f pyrgos-afc-static-site.zip
( cd out && zip -rq ../pyrgos-afc-static-site.zip . )

echo "✓ Static export ready:"
echo "  • folder: out/"
echo "  • zip:    pyrgos-afc-static-site.zip"
