/* =====================================================
   🛡️ MIDDLEWARE DE AUTENTICACIÓN - authMiddleware.js
   ===================================================== */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para verificar y validar tokens JWT
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token de acceso requerido',
        codigo: 'NO_TOKEN'
      });
    }

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

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no definido en variables de entorno');
      return res.status(500).json({
        success: false,
        mensaje: 'Error de configuración del servidor'
      });
    }

    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      const codeMap = {
        TokenExpiredError: 'TOKEN_EXPIRED',
        JsonWebTokenError: 'INVALID_TOKEN'
      };
      return res.status(401).json({
        success: false,
        mensaje: jwtError.message,
        codigo: codeMap[jwtError.name] || 'JWT_ERROR'
      });
    }

    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token malformado',
        codigo: 'MALFORMED_TOKEN'
      });
    }

    const usuario = await User.findById(decodedToken.id).select('-password');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado',
        codigo: 'USER_NOT_FOUND'
      });
    }

    if (usuario.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        mensaje: 'Cuenta suspendida o inactiva',
        codigo: 'ACCOUNT_INACTIVE',
        estado: usuario.estado
      });
    }

    User.findByIdAndUpdate(usuario._id, { 
      ultimoAcceso: new Date() 
    }).catch(err => {
      console.warn('⚠️ Error actualizando último acceso:', err.message);
    });

    req.usuario = usuario;
    req.token = token;

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
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
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
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Autenticación requerida'
      });
    }

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

    if (userRequests.has(userId)) {
      const userReqs = userRequests.get(userId);
      userRequests.set(userId, userReqs.filter(time => time > windowStart));
    }

    const currentRequests = userRequests.get(userId) || [];

    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        mensaje: 'Demasiadas peticiones. Intenta más tarde.',
        codigo: 'RATE_LIMIT_EXCEEDED'
      });
    }

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
