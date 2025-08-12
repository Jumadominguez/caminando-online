from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

# 🧨 Bases a preservar
bases_preservadas = {"admin"}

# 🧼 Eliminar todas las bases excepto admin
for base in client.list_database_names():
    if base not in bases_preservadas:
        client.drop_database(base)
        print(f"🗑️ Base eliminada: {base}")

# 🛒 Supermercados
supermercados = ["carrefour", "jumbo", "disco", "vea", "dia"]

for origen in supermercados:
    # Raw
    client[f"supermercados_raw_{origen}"]["filtros_raw"].insert_one({})
    client[f"supermercados_raw_{origen}"]["filtros_raw"].delete_many({})
    print(f"📦 Creada: supermercados_raw_{origen}.filtros_raw")

    # Normalized
    client[f"supermercados_normalized_{origen}"]["filtros"].insert_one({})
    client[f"supermercados_normalized_{origen}"]["filtros"].delete_many({})
    print(f"📦 Creada: supermercados_normalized_{origen}.filtros")

    # Metadata
    client[f"supermercados_metadata_{origen}"]["menu_categories"].insert_one({})
    client[f"supermercados_metadata_{origen}"]["menu_categories"].delete_many({})
    print(f"📦 Creada: supermercados_metadata_{origen}.menu_categories")

    # Offers
    client[f"supermercados_offers_{origen}"]["ofertas"].insert_one({})
    client[f"supermercados_offers_{origen}"]["ofertas"].delete_many({})
    print(f"📦 Creada: supermercados_offers_{origen}.ofertas")

# 👤 Administración
for col in ["usuarios", "roles", "logs"]:
    client["admin"][col].insert_one({})
    client["admin"][col].delete_many({})
    print(f"👤 Creada: admin.{col}")

# 📊 Auditoría y Analytics
estructura_auditoria = {
    "auditoria_analytics": "metrics",
    "auditoria_audit": "historial",
    "auditoria_scheduler": "tareas",
    "auditoria_logs": "scraper_logs"
}

for base, col in estructura_auditoria.items():
    client[base][col].insert_one({})
    client[base][col].delete_many({})
    print(f"📊 Creada: {base}.{col}")

# 💰 Precios y Productos
client["productos_precios"]["precios"].insert_one({})
client["productos_precios"]["precios"].delete_many({})
print("💰 Creada: productos_precios.precios")

client["productos_catalogo"]["catalogo"].insert_one({})
client["productos_catalogo"]["catalogo"].delete_many({})
print("💰 Creada: productos_catalogo.catalogo")

# 🔧 Sistema y Configuración
estructura_sistema = {
    "sistema_alerts": "notificaciones",
    "sistema_sessions": "tokens",
    "sistema_config": "parametros"
}

for base, col in estructura_sistema.items():
    client[base][col].insert_one({})
    client[base][col].delete_many({})
    print(f"🔧 Creada: {base}.{col}")

print("\n✅ Estructura MongoDB con prefijos jerárquicos creada exitosamente.")
