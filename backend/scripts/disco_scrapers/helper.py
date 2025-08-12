from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import datetime
import pandas as pd
import json
import time

# CONFIG
URL = "https://www.disco.com.ar/galletitas-rellenas-con-crema-sabor-original-354-gr-x-3-un-oreo-2/p"
SUPERMERCADO = "disco"
CATEGORIA = "almacen"
runId = f"{SUPERMERCADO}_{CATEGORIA}_{datetime.datetime.now():%Y%m%d_%H%M%S}"

# Arranca el navegador
options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(service=Service(), options=options)
driver.get(URL)
time.sleep(2)

# Parseo
html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

# JSON-LD
json_ld_tag = soup.find("script", type="application/ld+json")
json_ld = json.loads(json_ld_tag.string) if json_ld_tag else {}

# Función helper
def text_or_none(sel):
    el = soup.select_one(sel)
    return el.get_text(strip=True) if el else None

# Extracción
data = {
    "runId": runId,
    "supermercado": SUPERMERCADO,
    "categoria": CATEGORIA,
    "skuId": json_ld.get("sku"),
    "SKUcom": text_or_none(".vtex-product-identifier-0-x-product-identifier__value"),
    "productId": json_ld.get("productID"),
    "ean": json_ld.get("gtin13"),
    "referenceId": json_ld.get("mpn"),
    "nombre": text_or_none(".vtex-store-components-3-x-productNameContainer h1"),
    "descripcion": text_or_none(".vtex-store-components-3-x-productDescription"),
    "precio_final": text_or_none(".vtex-product-price-1-x-sellingPrice span"),
    "precio_original": text_or_none(".vtex-product-price-1-x-listPrice span"),
    "descuento": text_or_none(".vtex-product-price-1-x-discountPercentage span"),
    "precio_por_unidad": text_or_none(".vtex-product-price-1-x-unitPriceMeasurement span"),
    "disponibilidad": json_ld.get("availability"),
    "cantidad_minima": soup.select_one(".vtex-quantity-selector__input") and soup.select_one(".vtex-quantity-selector__input")["value"],
    "imagenes": [img["src"] for img in soup.find_all("img") if img.get("src")][:5],
    "marca": json_ld.get("brand", {}).get("name"),
    "specs": {  
        row.select_one(".vtex-product-specifications-1-x-specificationName").get_text(strip=True):
        row.select_one(".vtex-product-specifications-1-x-specificationValue").get_text(strip=True)
        for row in soup.select(".vtex-product-specifications-1-x-specificationItem")
    },
    "seo": {
        "title": soup.title.string if soup.title else None,
        "description": soup.find("meta", attrs={"name":"description"}) and soup.find("meta", attrs={"name":"description"})["content"],
        "keywords": soup.find("meta", attrs={"name":"keywords"}) and soup.find("meta", attrs={"name":"keywords"})["content"]
    },
    "json_ld": json_ld,
    "promociones": [],
    "api_price_stock": {},
    "seller_info": {},
    "tracking_analytics": {},
    "timestamp": datetime.datetime.now().isoformat()
}

driver.quit()

# Generar tabla Markdown
df = pd.json_normalize(data)
print(df.to_markdown(index=False))
