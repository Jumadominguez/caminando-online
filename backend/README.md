# Backend - Caminando Online v2

## Configuración del Servidor Python

### Instalación
```bash
cd E:/caminando-online/staging/backend/
pip install -r requirements.txt
python app.py
```

### Estructura
```
backend/
├── app/
│   ├── routes/          # Endpoints de la API
│   ├── models/          # Modelos de datos MongoDB
│   ├── services/        # Lógica de negocio
│   └── utils/           # Utilidades compartidas
├── scrapers/            # Web scrapers por supermercado
├── config/              # Configuraciones de BD y API
├── tests/               # Tests unitarios
└── requirements.txt     # Dependencias Python
```

### API Endpoints
- `GET /api/supermercados` - Lista de supermercados
- `GET /api/productos` - Productos con filtros
- `GET /api/precios/{producto_id}` - Comparación de precios
- `POST /api/auth/login` - Autenticación de usuarios