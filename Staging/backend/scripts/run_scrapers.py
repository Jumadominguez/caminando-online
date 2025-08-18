import importlib
import os
import sys

# Asegura que el path incluya el backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Lista de supermercados y sus módulos
SCRAPERS = {
    "jumbo": "scripts.jumbo_scraper.jumbo_complete_scraper",
    # "dia": "scripts.dia_scraper.dia_scraper",
    # "carrefour": "scripts.carrefour_scraper.carrefour_scraper",
}

def run_all_scrapers():
    for name, module_path in SCRAPERS.items():
        try:
            print(f"\n🛒 Ejecutando scraper de {name}...")
            scraper_module = importlib.import_module(module_path)
            scraper_module.run_scraper()
            print(f"✅ Scraper de {name} finalizado.\n")
        except Exception as e:
            print(f"❌ Error al ejecutar el scraper de {name}: {e}\n")

if __name__ == "__main__":
    run_all_scrapers()