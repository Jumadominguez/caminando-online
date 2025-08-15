/* =====================================================
   🛡️ MIDDLEWARE DE AUTENTICACIÓN - authMiddleware.js
   ===================================================== */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para verificar y validar tokens JWT
 * Protege rutas que requieren autenticación
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token de acceso requerido',
        codigo: 'NO_TOKEN'
      });
    }

    // Verificar formato: "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token de acceso inválido',
        codigo: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verificar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no definido en variables de entorno');
      return res.status(500).json({
        success: false,
        mensaje: 'Error de configuración del servidor'
      });
    }

    let decodedToken;
    
    try {
      // Decodificar y verificar token
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          mensaje: 'Token expirado',
          codigo: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          mensaje: 'Token inválido',
          codigo: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }

    // Verificar que el token contenga el ID del usuario
    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token malformado',
        codigo: 'MALFORMED_TOKEN'
      });
    }

    // Buscar usuario en la base de datos
    const usuario = await User.findById(decodedToken.id).select('-password');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado',
        codigo: 'USER_NOT_FOUND'
      });
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        mensaje: 'Cuenta suspendida o inactiva',
        codigo: 'ACCOUNT_INACTIVE',
        estado: usuario.estado
      });
    }

    // Actualizar último acceso (sin await para no bloquear)
    User.findByIdAndUpdate(usuario._id, { 
      ultimoAcceso: new Date() 
    }).catch(err => {
      console.warn('⚠️ Error actualizando último acceso:', err.message);
    });

    // Agregar usuario al request para uso en controladores
    req.usuario = usuario;
    req.token = token;

    // Continuar con el siguiente middleware/controlador
    next();

  } catch (error) {
    console.error('❌ Error en authMiddleware:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      codigo: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Permite que la ruta funcione con o sin token
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    // Si no hay token, continuar sin usuario
    if (!authHeader) {
      req.usuario = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token || !process.env.JWT_SECRET) {
      req.usuario = null;
      return next();
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decodedToken.id) {
        const usuario = await User.findById(decodedToken.id).select('-password');
        
        if (usuario && usuario.estado === 'activo') {
          req.usuario = usuario;
          req.token = token;
        }
      }
    } catch (jwtError) {
      // Ignorar errores de JWT en middleware opcional
      console.log('Token opcional inválido:', jwtError.message);
    }

    next();

  } catch (error) {
    console.error('❌ Error en optionalAuthMiddleware:', error);
    req.usuario = null;
    next();
  }
};

/**
 * Middleware para verificar roles específicos
 * Debe usarse después de authMiddleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Autenticación requerida'
      });
    }

    // Por ahora solo verificamos que sea admin (puedes expandir esto)
    if (roles.includes('admin') && req.usuario.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        mensaje: 'Permisos insuficientes'
      });
    }

    next();
  };
};

/**
 * Middleware para rate limiting por usuario
 */
const rateLimitPerUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.usuario) {
      return next();
    }

    const userId = req.usuario._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (userRequests.has(userId)) {
      const userReqs = userRequests.get(userId);
      userRequests.set(userId, userReqs.filter(time => time > windowStart));
    }

    // Obtener requests actuales del usuario
    const currentRequests = userRequests.get(userId) || [];

    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        mensaje: 'Demasiadas peticiones. Intenta más tarde.',
        codigo: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Agregar request actual
    currentRequests.push(now);
    userRequests.set(userId, currentRequests);

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  rateLimitPerUser
};