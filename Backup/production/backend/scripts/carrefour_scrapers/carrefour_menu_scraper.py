from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from datetime import datetime, timezone
import unicodedata
import re
import time

IGNORAR = {"ofertas", "destacados", "indumentaria"}
IGNORAR_GRUPOS = {"gama de precios"}

# 🔧 Normalización
def normalize_name(name: str) -> str:
    return name.lower().replace(" ", "_")

def normalize_grupo(grupo: str) -> str:
    return grupo.lower().replace(" ", "_")

def normalize_opciones(opciones: list) -> list:
    return [
        {
            "nombre": opt["nombre"],
            "cantidad": int(opt["cantidad"]),
            "checkbox_id": opt["checkbox_id"]
        }
        for opt in opciones
    ]

def normalize_text(text):
    if not isinstance(text, str):
        return text
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ASCII', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# 🔌 Setup
def setup_driver():
    opts = Options()
    return webdriver.Firefox(options=opts)

def setup_mongo():
    client = MongoClient("mongodb://localhost:27017/")
    return {
        "categorias_raw": client["supermercados_raw_carrefour"]["categorias_raw"],
        "filtros_raw": client["supermercados_raw_carrefour"]["filtros_raw"],
        "normalized": client["supermercados_normalized_carrefour"]["filtros_normalized"],
        "metadata": client["supermercados_metadata_carrefour"]["categorias_metadata"]
    }

# 🗃️ Guardado en MongoDB

def store_categoria_raw(filters_data: dict, category_name: str, collections):
    normalized_name = normalize_name(category_name)
    timestamp = datetime.now(timezone.utc)

    filters_array = [
        {"group": group_name, "options": options}
        for group_name, options in filters_data.items()
    ]

    document = {
        "category": category_name,
        "normalized": normalized_name,
        "timestamp": timestamp,
        "filters": filters_array
    }

    collections["categorias_raw"].replace_one(
        {"normalized": normalized_name},
        document,
        upsert=True
    )
    print(f"✅ RAW actualizado para categorias_raw: {category_name}")

def store_filtros_raw(filters_data: dict, category_name: str, collections):
    normalized_name = normalize_name(category_name)
    timestamp = datetime.now(timezone.utc)

    for group_name, options in filters_data.items():
        document = {
            "category": category_name,
            "normalized": normalized_name,
            "group": group_name,
            "options": options,
            "timestamp": timestamp
        }

        collections["filtros_raw"].replace_one(
            {"normalized": normalized_name, "group": group_name},
            document,
            upsert=True
        )
    print(f"✅ RAW actualizado para filtros_raw: {category_name}")


def store_filters_normalized(data: dict, category_name: str, collections):
    normalized_name = normalize_name(category_name)
    timestamp = datetime.now()
    for group_name, opciones in data.items():
        doc = {
            "supermercado": "carrefour",
            "categoria_original": category_name,
            "categoria_normalizada": normalized_name,
            "grupo": group_name,
            "grupo_normalizado": normalize_grupo(group_name),
            "opciones": normalize_opciones(opciones),
            "timestamp": timestamp
        }
        collections["normalized"].replace_one(
            {
                "categoria_normalizada": normalized_name,
                "grupo_normalizado": normalize_grupo(group_name)
            },
            doc,
            upsert=True
        )
    print(f"🧼 Normalized actualizado para categoría: {category_name}")

def store_metadata(data: dict, category_name: str, collections, url:str, version_scraper="carrefour_scraper_v1.0"):
    normalized_name = normalize_name(category_name)
    timestamp = datetime.now()
    grupos = []
    total_opciones = 0
    for group_name, opciones in data.items():
        grupo_norm = normalize_grupo(group_name)
        cantidad = len(opciones)
        total_opciones += cantidad
        grupos.append({
            "grupo_original": group_name,
            "grupo_normalizado": grupo_norm,
            "cantidad_opciones": cantidad
        })
    doc = {
        "supermercado": "carrefour",
        "categoria_original": category_name,
        "categoria_normalizada": normalized_name,
        "timestamp": timestamp,
        "grupos_detectados": len(data),
        "total_opciones": total_opciones,
        "grupos": grupos,
        "status": "success",
        "version_scraper": version_scraper,
        "URL": url,
        "errores": []
    }
    collections["metadata"].replace_one(
        {
            "categoria_normalizada": normalized_name,
            "version_scraper": version_scraper
        },
        doc,
        upsert=True
    )
    print(f"📝 Metadata actualizada para categoría: {category_name}")

# 🚀 Main
def main():
    print("🚀 Iniciando scraper Carrefour")
    driver = setup_driver()
    collections = setup_mongo()
    wait = WebDriverWait(driver, 30)

    driver.get("https://www.carrefour.com.ar/")
    time.sleep(3)

    try:
        categorias_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Categorías']")))
        driver.execute_script("arguments[0].click();", categorias_btn)
        print("✅ Click en 'Categorías'")
    except:
        print("❌ No se encontró el botón 'Categorías'")
        driver.quit()
        return

    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "ul.carrefourar-mega-menu-0-x-menuContainer")))
        time.sleep(2)

        items = driver.find_elements(By.CSS_SELECTOR, "ul.carrefourar-mega-menu-0-x-menuContainer > li")
        categorias = []

        for item in items:
            try:
                link = item.find_element(By.TAG_NAME, "a")
                text = link.text.strip().lower()
                href = link.get_attribute("href")
                if text in IGNORAR or not text or not href:
                    continue
                categorias.append({"nombre": text, "href": href})
            except:
                continue

        print(f"📋 Categorías válidas detectadas: {len(categorias)}")

        if not categorias:
            print("❌ No se encontró ninguna categoría válida")
            driver.quit()
            return

    except Exception as e:
        print(f"❌ Error extrayendo categorías: {e}")
        driver.quit()
        return

    # 🔁 Iterar por cada categoría
    for idx, cat in enumerate(categorias):
        print(f"\n🔄 [{idx+1}/{len(categorias)}] Procesando categoría: {cat['nombre']}")
        try:
            driver.get(cat["href"])
            time.sleep(3)

            try:
                privacidad_btn = driver.find_element(By.CSS_SELECTOR, "button#onetrust-accept-btn-handler")
                driver.execute_script("arguments[0].click();", privacidad_btn)
                time.sleep(1)
            except:
                pass

            wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
            filtro = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".vtex-flex-layout-0-x-flexCol--filterCol")))
            driver.execute_script("""
                const filtro = arguments[0];
                const rect = filtro.getBoundingClientRect();
                window.scrollBy({ top: rect.top - 100, behavior: 'instant' });
            """, filtro)
            time.sleep(1)

            titulos_raw = filtro.find_elements(By.CSS_SELECTOR, "div[class*='filterTitle']")
            print(f"🔍 {len(titulos_raw)} grupos de filtros detectados")

            data = {}

            for titulo in titulos_raw:
                nombre = titulo.text.strip()
                if not nombre or nombre.lower() in IGNORAR_GRUPOS:
                    continue
                try:
                    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", titulo)
                    driver.execute_script("arguments[0].click();", titulo)
                    try:
                        ver_mas = titulo.find_element(By.XPATH, "./following::button[contains(@class,'seeMoreButton')]")
                        driver.execute_script("arguments[0].click();", ver_mas)
                        time.sleep(1)
                    except:
                        pass

                    contenedor = titulo.find_element(By.XPATH, "./following::div[contains(@class,'filterTemplateOverflow')]")
                    items = contenedor.find_elements(By.CSS_SELECTOR, "div[class*='filterItem']")

                    if nombre not in data:
                        data[nombre] = []

                    for item in items:
                        try:
                            label_raw = item.find_element(By.CSS_SELECTOR, "label").text.strip()
                            cantidad_raw = item.find_element(By.CSS_SELECTOR, "span[class*='productCount']").text.strip()
                            checkbox = item.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
                            checkbox_id = checkbox.get_attribute("id")

                            label_clean = label_raw.split("(")[0].strip()
                            cantidad_clean = cantidad_raw.replace("(", "").replace(")", "").strip()
                            cantidad_int = int(cantidad_clean) if cantidad_clean.isdigit() else None

                            if cantidad_int is None:
                                continue

                            data[nombre].append({
                                "nombre": label_clean,
                                "cantidad": cantidad_int,
                                "checkbox_id": checkbox_id
                            })

                        except:
                            continue

                except:
                    continue

                # 🗃️ Guardado final
                store_categoria_raw(category_name=cat["nombre"], filters_data=data, collections=collections)
                store_filtros_raw(filters_data=data, category_name=cat["nombre"], collections=collections)
                store_filters_normalized(data=data, category_name=cat["nombre"], collections=collections)
                store_metadata(data=data, category_name=cat["nombre"], collections=collections, url=cat["href"])

        except Exception as e:
            print(f"❌ Error en categoría '{cat['nombre']}': {e}")
            continue

    input("Presiona Enter para cerrar...")
    driver.quit()

if __name__ == "__main__":
    main()