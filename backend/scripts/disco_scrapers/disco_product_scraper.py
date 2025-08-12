from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pymongo import MongoClient
from bs4 import BeautifulSoup

import time
import datetime
import json
import requests
import re

# 0. Parámetros fijos
SUPERMERCADO = "disco"
CATEGORIA    = "almacen"
runId        = f"{SUPERMERCADO}_{CATEGORIA}_{datetime.datetime.now():%Y%m%d_%H%M%S}"

# 1. Conexión a MongoDB
client     = MongoClient("mongodb://localhost:27017/")
db         = client["productos_catalogo"]
collection = db["catalogo"]

# 2. Inicializar Selenium
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
service = Service()
driver  = webdriver.Chrome(service=service, options=options)
wait    = WebDriverWait(driver, 10)

# 3. Cargar listado y detectar paginador
driver.get("https://www.disco.com.ar/almacen")
print("[INFO] Página cargada: Disco - Almacén")
time.sleep(2)

for _ in range(20):
    try:
        driver.find_element(By.CLASS_NAME,
                            "discoargentina-search-result-custom-1-x-content-pagination")
        print("[INFO] Paginador detectado, layout completo")
        break
    except:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
else:
    print("[ERROR] No se detectó el paginador tras 20 intentos")
    driver.quit()
    exit()

# 4. Tomar el primer producto
try:
    cont = driver.find_element(By.CLASS_NAME,
                               "vtex-product-summary-2-x-container")
    link = cont.find_element(By.TAG_NAME, "a").get_attribute("href")
    print(f"[INFO] Primer producto detectado: {link}")
except Exception as e:
    print(f"[ERROR] No se pudo detectar el primer producto: {e}")
    driver.quit()
    exit()

# 5. Abrir ficha en nueva pestaña
driver.execute_script(f"window.open('{link}', '_blank')")
driver.switch_to.window(driver.window_handles[-1])
wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
time.sleep(2)

# 6. Obtener HTML y BeautifulSoup
html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

# 8. Scrape de datos en página
# 8.1 JSON-LD
json_ld_tag = soup.find("script", type="application/ld+json")
json_ld     = json.loads(json_ld_tag.string) if json_ld_tag else {}

# 8.2 SEO
seo = {
    "title":       soup.title.string if soup.title else None,
    "description": soup.find("meta", {"name": "description"})
                       and soup.find("meta", {"name": "description"}).get("content"),
    "keywords":    soup.find("meta", {"name": "keywords"})
                       and soup.find("meta", {"name": "keywords"}).get("content")
}

# 8.3 Specs (HTML + JSON-LD)
specs = {}
for spec in soup.select(".vtex-product-specifications-1-x-specificationItem"):
    name = spec.select_one(".vtex-product-specifications-1-x-specificationName")
    val  = spec.select_one(".vtex-product-specifications-1-x-specificationValue")
    if name and val:
        specs[name.text.strip()] = val.text.strip()

specs_jsonld = json_ld.get("additionalProperty", [])
for item in specs_jsonld:
    name = item.get("name")
    val  = item.get("value")
    if name and val:
        specs[name.strip()] = val.strip()

# 8.4 Precios
precio_final = (
    soup.select_one(".vtex-product-price-1-x-sellingPrice span") or
    soup.select_one(".product-price_bestPrice") or
    str(json_ld.get("price"))
)

precio_original = (
    soup.select_one(".vtex-product-price-1-x-listPrice span") or
    soup.select_one(".product-price_listPrice") or
    str(json_ld.get("lowPrice"))
)

descuento = soup.select_one(".vtex-product-price-1-x-discountPercentage span")
precio_por_unidad = soup.select_one(".vtex-product-price-1-x-unitPriceMeasurement span")

# 8.5 Metadata básica
nombre_jsonld = json_ld.get("name")
nombre_html   = soup.select_one(".vtex-store-components-3-x-productNameContainer h1")
nombre        = nombre_jsonld or (nombre_html.text.strip() if nombre_html else None)

descripcion = json_ld.get("description")
imagenes    = [img["src"] for img in soup.select("img[src]")]

# 8.6 Identificadores
skuId       = json_ld.get("sku")
productId   = json_ld.get("productID")
ean         = json_ld.get("gtin13") or json_ld.get("gtin")
referenceId = json_ld.get("referenceId")
SKU_com_el  = soup.select_one(".vtex-product-identifier-0-x-product-identifier__value")
SKUcom      = SKU_com_el.text.strip() if SKU_com_el else None

# 8.7 Disponibilidad, marca y cantidad mínima
disponibilidad  = json_ld.get("availability")
cantidad_input  = soup.select_one("input.vtex-quantity-selector__input")
if cantidad_input:
    cantidad_minima = cantidad_input.get("min") or cantidad_input.get("value")
else:
    cantidad_minima = None

marca = json_ld.get("brand", {}).get("name")

# 8.8 Promociones
promociones = json_ld.get("promotions", [])

# 8.9 Seller Info
seller_info = json_ld.get("seller", {})

# 8.10 Tracking Analytics
tracking = re.findall(r'ga\((.*?)\)|dataLayer\s*=\s*\[\s*.*?\]', html)

# 9. API Price & Stock VTEX
api_price_stock = None

# 10. Armar documento final
doc = {
    "runId":            runId,
    "supermercado":     SUPERMERCADO,
    "categoria":        CATEGORIA,

    "skuId":            skuId,
    "productId":        productId,
    "ean":              ean,
    "SKUcom":           SKUcom,
    "referenceId":      referenceId,

    "nombre":           nombre,
    "descripcion":      descripcion,

    "precio_final":     precio_final.text.strip() if hasattr(precio_final, "text") else precio_final,
    "precio_original":  precio_original.text.strip() if hasattr(precio_original, "text") else precio_original,
    "descuento":        descuento.text.strip() if descuento else None,
    "precio_por_unidad":precio_por_unidad.text.strip() if precio_por_unidad else None,

    "disponibilidad":   disponibilidad,
    "cantidad_minima":  cantidad_minima,

    "imagenes":         imagenes,
    "marca":            marca,
    "specs":            specs,

    "seo":              seo,
    "json_ld":          json_ld,

    "promociones":      promociones,
    "api_price_stock":  api_price_stock,
    "seller_info":      seller_info,
    "tracking_analytics": {"raw": tracking},

    "timestamp":        datetime.datetime.now()
}

# 11. Upsert en MongoDB (filtro solo skuId)
collection.update_one(
    {"skuId": skuId},
    {"$set": doc},
    upsert=True
)
print(f"[INFO] Producto guardado: {skuId}")

# 12. Cerrar pestaña y volver
driver.close()
driver.switch_to.window(driver.window_handles[0])
