#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: $0 <productoDisco.txt>"
  exit 1
fi

INPUT="$1"
OUT="resultado_extraccion.txt"

: > "$OUT"

extract() {
  local LABEL="$1"
  local GREP_OPTS="$2"
  local PATTERN="$3"

  {
    echo "=== $LABEL ==="
    if grep -P $GREP_OPTS "$PATTERN" "$INPUT" > /dev/null; then
      echo "$PATTERN"
    else
      echo null
    fi
    echo
  } >> "$OUT"
}

{
  echo "=== JSON-LD BLOCK ==="
  if grep -Poz '<script[^>]*type="application/ld\+json"[^>]*>[\s\S]*?</script>' "$INPUT" > /dev/null; then
    echo '<script[^>]*type="application/ld\+json"[^>]*>[\s\S]*?</script>'
  else
    echo null
  fi
  echo
} >> "$OUT"

extract  "SKU ID"                         "-Po" '"sku"\s*:\s*"[^"]*"'
extract  "Product ID"                     "-Po" 'data-product-id="[^"]+"'
extract  "EAN"                            "-Po" '"gtin13"\s*:\s*"[^"]*"|\"gtin\"\s*:\s*"[^"]*"'
extract  "referenceId"                    "-Po" '"referenceId"\s*:\s*"[^"]*"'
extract  "Nombre del producto"            "-Po" '"@type"\s*:\s*"Product"[\s\S]*?"name"\s*:\s*"[^"]*"'
extract  "Descripción"                    "-Po" '"description"\s*:\s*"[^"]*"'
extract  "Precio final"                   "-Po" '<span[^>]*class="[^"]*product-price_bestPrice[^"]*"[^>]*>[^<]+|"price"\s*:\s*\d+(\.\d+)?'
extract  "Precio original"                "-Po" '<span[^>]*class="[^"]*product-price_listPrice[^"]*"[^>]*>[^<]+|"lowPrice"\s*:\s*\d+(\.\d+)?'
extract  "Descuento"                      "-Po" '<span[^>]*class="[^"]*product-price_discountPercentage[^"]*"[^>]*>[^<]+'
extract  "Precio por unidad"              "-Po" '<span[^>]*class="[^"]*product-price_pricePerUnit[^"]*"[^>]*>[^<]+'
extract  "Disponibilidad"                 "-Po" '"availability"\s*:\s*"[^"]*"'
extract  "Cantidad mínima"                "-Po" '<input[^>]*min="[^"]+"'
extract  "Imágenes"                       "-Po" '<img[^>]*src="[^"]+"'
extract  "Vídeos"                         "-Po" '<(?:video|source)[^>]*src="[^"]+"'
extract  "Categoría (breadcrumb)"         "-Poz" '<nav[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>[\s\S]*?</nav>|"@type"\s*:\s*"BreadcrumbList"[\s\S]*?\]

'
extract  "Marca"                          "-Po" '"brand"\s*:\s*\{[^}]*\}'
extract  "Specs"                          "-Po" '"additionalProperty"\s*:\s*

\[[\s\S]*?\]

'
extract  "Meta Title"                     "-Po" '<title>.*?</title>'
extract  "Meta Description"               "-Po" '<meta[^>]*name="description"[^>]*content="[^"]*"'
extract  "Meta Keywords"                  "-Po" '<meta[^>]*name="keywords"[^>]*content="[^"]*"'
extract  "Reseñas (reviewCount)"          "-Po" '"reviewCount"\s*:\s*\d+'
extract  "Aggregate Rating"               "-Po" '"aggregateRating"\s*:\s*\{[^}]*\}'
extract  "Promociones"                    "-Po" '"promotions"\s*:\s*

\[[\s\S]*?\]

'
{
  echo "=== API Price / Stock ==="
  echo null
  echo
} >> "$OUT"
extract  "Seller Info"                    "-Po" '"seller"\s*:\s*\{[^}]*\}'
extract  "Tracking Analytics"             "-Po" 