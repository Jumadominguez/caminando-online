"""
Caminando Online v2 - Backend API
Comparador de Precios de Supermercados Argentinos
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración de MongoDB
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/caminando-online-v2')
client = MongoClient(MONGO_URI)
db = client.get_database()

@app.route('/api/status', methods=['GET'])
def status():
    """Health check del servidor"""
    return jsonify({
        'status': 'online',
        'version': '2.0.0',
        'message': 'Caminando Online v2 Backend API'
    })

@app.route('/api/supermercados', methods=['GET'])
def get_supermercados():
    """Obtener lista de supermercados disponibles"""
    supermercados = [
        {
            'id': 'carrefour',
            'nombre': 'Carrefour',
            'logo': 'carrefour-logo.svg',
            'activo': True
        },
        {
            'id': 'disco',
            'nombre': 'Disco',
            'logo': 'disco-logo.svg',
            'activo': True
        },
        {
            'id': 'jumbo',
            'nombre': 'Jumbo',
            'logo': 'jumbo-logo.svg',
            'activo': True
        },
        {
            'id': 'dia',
            'nombre': 'Día',
            'logo': 'dia-logo.svg',
            'activo': True
        },
        {
            'id': 'vea',
            'nombre': 'Vea',
            'logo': 'vea-logo.svg',
            'activo': True
        }
    ]
    
    return jsonify({
        'success': True,
        'data': supermercados
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Caminando Online v2 Backend iniciando...")
    print(f"📡 Puerto: {port}")
    print(f"🔧 Debug: {debug}")
    print(f"🗄️ MongoDB: {MONGO_URI}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)