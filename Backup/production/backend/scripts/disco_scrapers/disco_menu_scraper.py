# disco_scraper.py
# Requiere: selenium, pandas, webdriver_manager, pymongo
# > pip install selenium pandas webdriver-manager pymongo

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from pymongo import MongoClient
from datetime import datetime, timezone
import time
import unicodedata
import re
import os

HOME_URL = "https://www.disco.com.ar/"

def setup_driver(headless: bool = True):
    opts = Options()
    if headless:
        opts.add_argument("--headless")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option("useAutomationExtension", False)
    opts.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    opts.add_argument("--remote-debugging-port=9222")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)

def wait_for_page_load(driver, wait):
    print("🔄 Esperando que cargue la página...")
    try:
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        time.sleep(5)
        print("✅ Página cargada")
        return True
    except Exception as e:
        print(f"❌ Error esperando carga: {e}")
        return False

def deploy_categories_menu(driver, wait):
    print("🔄 Desplegando menú de categorías...")
    try:
        categories_button = wait.until(
            EC.element_to_be_clickable((By.XPATH,
                "//div[contains(@class, 'vtex-menu-2-x-styledLinkContent--header-category') and contains(text(), 'Categorías')]"
            ))
        )
        print("✅ Botón 'Categorías' encontrado")
        ActionChains(driver).move_to_element(categories_button).perform()
        time.sleep(2)
        print("✅ Hover realizado sobre 'Categorías'")
        return True
    except Exception as e:
        print(f"❌ Error desplegando menú: {e}")
        return False

def get_all_category_links(driver, wait):
    print("🔄 Obteniendo enlaces de todas las categorías...")
    try:
        category_selectors = [
            "//div[contains(@class, 'vtex-menu-2-x-submenu')]//a",
            "//div[contains(@class, 'vtex-menu-2-x-menuDropdown')]//a",
            "//ul[contains(@class, 'vtex-menu-2-x-submenuList')]//a",
            "//div[contains(@class, 'submenu')]//a",
            "//*[contains(@class, \"vtex-menu\")]//a[contains(@href, \"disco.com.ar\")]"
        ]
        category_links = []
        for selector in category_selectors:
            try:
                elements = driver.find_elements(By.XPATH, selector)
                for element in elements:
                    if element.is_displayed():
                        href = element.get_attribute('href')
                        text = element.text.strip()
                        if href and text and 'disco.com.ar' in href:
                            if not any(link['href'] == href for link in category_links):
                                category_links.append({
                                    'name': text,
                                    'href': href,
                                    'element': element
                                })
                if category_links:
                    print(f"✅ Encontrados {len(category_links)} enlaces con: {selector}")
                    break
            except Exception as e:
                print(f"⚠️  Selector {selector} falló: {e}")
        return category_links
    except Exception as e:
        print(f"❌ Error obteniendo enlaces: {e}")
        return []

def find_filter_container(driver):
    selectors = [
        "aside[class*='vtex-search-result-3-x-filter__filtersWrapper']",
        "aside[class*='filtersWrapper']",
        "[class*='filter'][class*='Wrapper']"
    ]
    for selector in selectors:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if elements:
                print(f"✅ Contenedor encontrado con: {selector}")
                return elements[0]
        except Exception as e:
            print(f"⚠️  Selector {selector} falló: {e}")
    print("❌ No se encontró el contenedor de filtros")
    return None

def scroll_container_to_reveal_groups(container, driver):
    driver.execute_script("arguments[0].scrollIntoView(true);", container)
    time.sleep(1)
    last_height = driver.execute_script("return arguments[0].scrollHeight", container)
    while True:
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", container)
        time.sleep(2)
        new_height = driver.execute_script("return arguments[0].scrollHeight", container)
        if new_height == last_height:
            break
        last_height = new_height

def get_all_group_titles(container):
    selectors = [
        "div.vtex-search-result-3-x-filterTitle",
        "div[class*='filterTitle']"
    ]
    for selector in selectors:
        try:
            groups = container.find_elements(By.CSS_SELECTOR, selector)
            return [g.text.strip() for g in groups if g.text.strip()]
        except:
            continue
    return []

def process_single_group(container, driver, group_name, group_index):
    try:
        group_elements = container.find_elements(By.XPATH, f".//div[contains(@class, 'filterTitle')]//span[contains(text(), '{group_name}')]")
        if not group_elements:
            return []
        group_element = group_elements[0]
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", group_element)
        time.sleep(1)
        parent_container = group_element.find_element(By.XPATH, "./ancestor::div[contains(@class, 'filter__container')]")
        see_more_selectors = [
            ".//div[contains(@class, 'seeMore')]",
            ".//button[contains(text(), 'Mostrar')]"
        ]
        for selector in see_more_selectors:
            try:
                buttons = parent_container.find_elements(By.XPATH, selector)
                if buttons:
                    driver.execute_script("arguments[0].click();", buttons[0])
                    time.sleep(2)
                    break
            except:
                continue
        option_selectors = [
            ".//label[contains(@class, 'vtex-checkbox__label')]"
        ]
        for opt_selector in option_selectors:
            try:
                found_options = parent_container.find_elements(By.XPATH, opt_selector)
                return [lbl.text.strip() for lbl in found_options if lbl.text.strip()]
            except:
                continue
        return []
    except:
        return []

def scrape_all_groups_sequentially(container, driver):
    scroll_container_to_reveal_groups(container, driver)
    group_names = get_all_group_titles(container)
    all_data = {}
    for i, group_name in enumerate(group_names):
        options = process_single_group(container, driver, group_name, i)
        if options:
            all_data[group_name] = options
        time.sleep(1)
    return all_data

def normalize_name(name: str) -> str:
    name = unicodedata.normalize('NFKD', name).encode('ASCII', 'ignore').decode('utf-8')
    name = re.sub(r'\W+', '_', name).lower()
    return name.strip('_')

def normalize_grupo(grupo):
    g = unicodedata.normalize('NFKD', grupo).encode('ASCII', 'ignore').decode().lower().strip()
    if g.endswith('s') and not g.endswith('es'):
        g = g[:-1]
    return g

def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode().lower().strip()

def normalize_opciones(opciones):
    return sorted(list(set([normalize_text(o) for o in opciones if o])))

def store_categories_in_mongo(data: dict, category_name: str, category_url: str):
    client = MongoClient("mongodb://localhost:27017/")
    db = client["supermercados_raw_disco"]
    collection = db["categorias_raw"]
    normalized_name = normalize_name(category_name)
    filters_array = [{"group": k, "options": v} for k, v in data.items()]
    document = {
        "category": category_name,
        "normalized": normalized_name,
        "timestamp": datetime.now(timezone.utc),
        "URL": category_url,
        "filters": filters_array
    }
    collection.replace_one({"normalized": normalized_name}, document, upsert=True)

def store_filters_in_mongo(data: dict, category_name: str):
    client = MongoClient("mongodb://localhost:27017/")
    db = client["supermercados_raw_disco"]
    collection = db["filtros_raw"]
    normalized_name = normalize_name(category_name)

    for group_name, options in data.items():
        document = {
            "category": category_name,
            "normalized": normalized_name,
            "group": group_name,
            "options": options,
            "timestamp": datetime.now(timezone.utc)
        }
        collection.replace_one(
            {"normalized": normalized_name, "group": group_name},
            document,
            upsert=True
        )

def normalize_and_store(data: dict, category_name: str, category_url: str):
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["supermercados_normalized_disco"]
        collection = db["filtros"]  # ✅ Definí la colección explícitamente
        normalized_name = normalize_name(category_name)
        timestamp = datetime.now()

        for group_name, opciones in data.items():
            doc = {
                "supermercado": "disco",
                "categoria_original": category_name,
                "categoria_normalizada": normalized_name,
                "grupo": group_name,
                "grupo_normalizado": normalize_grupo(group_name),
                "opciones": normalize_opciones(opciones),
                "URL": category_url,
                "timestamp": timestamp
            }
            collection.insert_one(doc)
        print(f"🧼 Normalized data guardada para categoría: {category_name}")

    except Exception as e:
        print(f"❌ Error guardando normalized data: {e}")

def store_metadata(data: dict, category_name: str, category_url: str, version_scraper: str = "disco_scraper_v1.0"):
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["supermercados_metadata_disco"]
        collection = db["categorias_metadata"]  # ✅ define la colección explícitamente
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
            "supermercado": "disco",
            "categoria_original": category_name,
            "categoria_normalizada": normalized_name,
            "timestamp": timestamp,
            "grupos_detectados": len(data),
            "total_opciones": total_opciones,
            "grupos": grupos,
            "status": "success",
            "URL": category_url,
            "version_scraper": version_scraper,
            "errores": []
        }

        collection.update_one(
            {
                "supermercado": "disco",
                "categoria_normalizada": normalized_name
            },
            { "$set": doc },
            upsert=True
        )
        print(f"📝 Metadata guardada para categoría: {category_name}")

    except Exception as e:
        print(f"❌ Error guardando metadata: {e}")

def scrape_category_filters(driver, wait, category_url, category_name):
    print(f"🔄 Scrapeando filtros de: {category_name}")
    try:
        driver.get(category_url)
        if not wait_for_page_load(driver, wait):
            print(f"❌ No se pudo cargar la página de {category_name}")
            return False
        container = find_filter_container(driver)
        if not container:
            print(f"❌ No se encontró contenedor de filtros en {category_name}")
            return False
        filtros = scrape_all_groups_sequentially(container, driver)
        if filtros:
            store_categories_in_mongo(filtros, category_name, category_url)
            store_filters_in_mongo(filtros, category_name)
            normalize_and_store(filtros, category_name, category_url)
            store_metadata(filtros, category_name, category_url)
            return True
        else:
            print(f"⚠️  No se extrajeron datos de {category_name}")
            return False
    except Exception as e:
        print(f"❌ Error scrapeando {category_name}: {e}")
        return False

def main():
    print("🚀 Iniciando scraper de Disco...")

    base_dir = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Temp", "disco_profiles")
    os.makedirs(base_dir, exist_ok=True)

    driver = setup_driver(headless=False)
    wait = WebDriverWait(driver, 30)

    try:
        print(f"🌐 Navegando al home: {HOME_URL}")
        driver.get(HOME_URL)

        if not wait_for_page_load(driver, wait):
            print("❌ La página home no cargó correctamente")
            return

        if not deploy_categories_menu(driver, wait):
            print("❌ No se pudo desplegar el menú de categorías")
            return

        category_links = get_all_category_links(driver, wait)
        if not category_links:
            print("❌ No se encontraron enlaces de categorías")
            return

        print(f"🎯 Procesando {len(category_links)} categorías...")

        successful_categories = 0
        for i, category in enumerate(category_links, 1):
            print(f"\n{'='*60}")
            print(f"📂 Procesando categoría {i}/{len(category_links)}: {category['name']}")
            print(f"🔗 URL: {category['href']}")
            print(f"{'='*60}")

            if scrape_category_filters(driver, wait, category['href'], category['name']):
                successful_categories += 1
                print(f"✅ Categoría {category['name']} procesada exitosamente")
            else:
                print(f"❌ Error procesando categoría {category['name']}")

            if i < len(category_links):
                print("🔄 Volviendo al home para la siguiente categoría...")
                driver.get(HOME_URL)
                if wait_for_page_load(driver, wait):
                    if not deploy_categories_menu(driver, wait):
                        print("⚠️  Error desplegando menú para siguiente categoría")
                        break
                else:
                    print("⚠️  Error cargando home para siguiente categoría")
                    break

        print(f"\n🎉 ¡Proceso completado!")
        print(f"📊 Categorías procesadas exitosamente: {successful_categories}/{len(category_links)}")

    except Exception as e:
        print(f"❌ Error general: {e}")

    finally:
        print("🛑 Scraping finalizado. Presiona Enter para cerrar el navegador...")
        input()
        driver.quit()

if __name__ == "__main__":
    main()
