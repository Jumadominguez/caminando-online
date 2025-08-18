/* =====================================================
   👤 CONTROLADOR DE USUARIOS COMPLETO - usersController.js
   ===================================================== */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * 🛡️ Utilidades de validación
 */
const validationUtils = {
  // Validar email
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validar contraseña
  isValidPassword: (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  // Validar teléfono argentino
  isValidPhone: (phone) => {
    const regex = /^(\+54\s?9?\s?)?(\d{2,4}\s?\d{4}\s?\d{4}|\d{10,11})$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  // Validar DNI argentino
  isValidDNI: (dni) => {
    const regex = /^\d{7,8}$/;
    return regex.test(dni);
  },

  // Validar nombre
  isValidName: (name) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    return regex.test(name.trim());
  }
};

/**
 * 🔐 Utilidades de JWT
 */
const jwtUtils = {
  // Generar token
  generateToken: (userId) => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no definido en variables de entorno');
    }
    
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token válido por 7 días
    );
  },

  // Verificar token
  verifyToken: (token) => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no definido en variables de entorno');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};

/**
 * 📝 REGISTRO DE USUARIO
 */
const registerUser = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      dni,
      password,
      fechaNacimiento,
      configuraciones
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !telefono || !dni || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos obligatorios deben estar completos',
        campos: ['nombre', 'apellido', 'email', 'telefono', 'dni', 'password']
      });
    }

    // Validaciones específicas
    if (!validationUtils.isValidName(nombre)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Nombre inválido',
        campo: 'nombre'
      });
    }

    if (!validationUtils.isValidName(apellido)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Apellido inválido',
        campo: 'apellido'
      });
    }

    if (!validationUtils.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email inválido',
        campo: 'email'
      });
    }

    if (!validationUtils.isValidPhone(telefono)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Teléfono inválido',
        campo: 'telefono'
      });
    }

    if (!validationUtils.isValidDNI(dni)) {
      return res.status(400).json({
        success: false,
        mensaje: 'DNI inválido (debe tener 7-8 dígitos)',
        campo: 'dni'
      });
    }

    if (!validationUtils.isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número',
        campo: 'password'
      });
    }

    // Verificar si el usuario ya existe (por email o DNI)
    const usuarioExistente = await User.buscarPorEmailODNI(email) || await User.buscarPorEmailODNI(dni);
    
    if (usuarioExistente) {
      const campo = usuarioExistente.email === email.toLowerCase() ? 'email' : 'dni';
      return res.status(400).json({
        success: false,
        mensaje: `${campo === 'email' ? 'Este email' : 'Este DNI'} ya está registrado`,
        campo
      });
    }

    // Preparar datos del usuario
    const datosUsuario = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.toLowerCase().trim(),
      telefono: telefono.trim(),
      dni: dni.trim(),
      password,
      ipRegistro: req.ip || req.connection.remoteAddress
    };

    // Agregar fecha de nacimiento si se proporciona
    if (fechaNacimiento) {
      datosUsuario.fechaNacimiento = new Date(fechaNacimiento);
    }

    // Agregar configuraciones si se proporcionan
    if (configuraciones) {
      datosUsuario.configuraciones = {
        notificaciones: {
          email: configuraciones.notificaciones?.email ?? true,
          sms: configuraciones.notificaciones?.sms ?? false,
          ofertas: configuraciones.notificaciones?.ofertas ?? true
        },
        privacidad: {
          compartirDatos: configuraciones.privacidad?.compartirDatos ?? false,
          recibirMarketing: configuraciones.privacidad?.recibirMarketing ?? false
        }
      };
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User(datosUsuario);
    await nuevoUsuario.save();

    // Generar token JWT
    const token = jwtUtils.generateToken(nuevoUsuario._id);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario.getDatosPublicos()
    });

    console.log(`✅ Usuario registrado: ${email} (${nuevoUsuario._id})`);

  } catch (error) {
    console.error('❌ Error en registro:', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const campos = Object.keys(error.errors);
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: campos.map(campo => ({
          campo,
          mensaje: error.errors[campo].message
        }))
      });
    }

    // Manejar errores de duplicado (código 11000)
    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        mensaje: `${campo === 'email' ? 'Email' : 'DNI'} ya está en uso`,
        campo
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 🔐 LOGIN DE USUARIO
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    if (!validationUtils.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email inválido'
      });
    }

    // Buscar usuario por email
    const usuario = await User.findOne({ email: email.toLowerCase() });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Verificar estado del usuario
    if (usuario.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        mensaje: 'Cuenta suspendida o inactiva. Contacta soporte.',
        estado: usuario.estado
      });
    }

    // Verificar contraseña
    const esPasswordValido = await usuario.compararPassword(password);
    
    if (!esPasswordValido) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();
    await usuario.save();

    // Generar token JWT
    const token = jwtUtils.generateToken(usuario._id);

    // Respuesta exitosa
    res.json({
      success: true,
      mensaje: 'Login exitoso',
      token,
      usuario: usuario.getDatosPublicos()
    });

    console.log(`✅ Login exitoso: ${email} (${usuario._id})`);

  } catch (error) {
    console.error('❌ Error en login:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 👤 OBTENER PERFIL DE USUARIO
 */
const getUserProfile = async (req, res) => {
  try {
    // El usuario viene del middleware de autenticación
    const usuario = await User.findById(req.usuario.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario: usuario.getDatosPublicos()
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * ✏️ ACTUALIZAR PERFIL DE USUARIO
 */
const updateUserProfile = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      configuraciones
    } = req.body;

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Validar y actualizar campos proporcionados
    const actualizaciones = {};

    if (nombre !== undefined) {
      if (!validationUtils.isValidName(nombre)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Nombre inválido',
          campo: 'nombre'
        });
      }
      actualizaciones.nombre = nombre.trim();
    }

    if (apellido !== undefined) {
      if (!validationUtils.isValidName(apellido)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Apellido inválido',
          campo: 'apellido'
        });
      }
      actualizaciones.apellido = apellido.trim();
    }

    if (telefono !== undefined) {
      if (!validationUtils.isValidPhone(telefono)) {
        return res.status(400).json({
          success: false,
          mensaje: 'Teléfono inválido',
          campo: 'telefono'
        });
      }
      actualizaciones.telefono = telefono.trim();
    }

    if (fechaNacimiento !== undefined) {
      actualizaciones.fechaNacimiento = new Date(fechaNacimiento);
    }

    if (configuraciones !== undefined) {
      actualizaciones.configuraciones = {
        ...usuario.configuraciones,
        ...configuraciones
      };
    }

    // Aplicar actualizaciones
    Object.assign(usuario, actualizaciones);
    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Perfil actualizado exitosamente',
      usuario: usuario.getDatosPublicos()
    });

    console.log(`✅ Perfil actualizado: ${usuario.email} (${usuario._id})`);

  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    
    if (error.name === 'ValidationError') {
      const campos = Object.keys(error.errors);
      return res.status(400).json({
        success: false,
        mensaje: 'Datos inválidos',
        errores: campos.map(campo => ({
          campo,
          mensaje: error.errors[campo].message
        }))
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 🔒 CAMBIAR CONTRASEÑA
 */
const changePassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        mensaje: 'Contraseña actual y nueva son obligatorias'
      });
    }

    if (!validationUtils.isValidPassword(passwordNuevo)) {
      return res.status(400).json({
        success: false,
        mensaje: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número'
      });
    }

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const esPasswordActualValido = await usuario.compararPassword(passwordActual);
    
    if (!esPasswordActualValido) {
      return res.status(401).json({
        success: false,
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    usuario.password = passwordNuevo;
    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Contraseña cambiada exitosamente'
    });

    console.log(`✅ Contraseña cambiada: ${usuario.email} (${usuario._id})`);

  } catch (error) {
    console.error('❌ Error cambiando contraseña:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 🏠 AGREGAR DIRECCIÓN
 */
const addAddress = async (req, res) => {
  try {
    const {
      alias,
      calle,
      numero,
      piso,
      departamento,
      codigoPostal,
      localidad,
      provincia,
      contacto,
      esPrincipal
    } = req.body;

    // Validaciones básicas
    if (!alias || !calle || !numero || !codigoPostal || !localidad || !provincia) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos obligatorios: alias, calle, numero, codigoPostal, localidad, provincia'
      });
    }

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Preparar datos de la dirección
    const nuevaDireccion = {
      alias: alias.trim(),
      calle: calle.trim(),
      numero: numero.trim(),
      codigoPostal: codigoPostal.trim(),
      localidad: localidad.trim(),
      provincia: provincia.trim(),
      esPrincipal: esPrincipal || false
    };

    // Campos opcionales
    if (piso) nuevaDireccion.piso = piso.trim();
    if (departamento) nuevaDireccion.departamento = departamento.trim();
    if (contacto) {
      nuevaDireccion.contacto = {
        nombre: contacto.nombre?.trim(),
        telefono: contacto.telefono?.trim(),
        instrucciones: contacto.instrucciones?.trim()
      };
    }

    // Agregar dirección usando el método del modelo
    await usuario.agregarDireccion(nuevaDireccion);

    res.status(201).json({
      success: true,
      mensaje: 'Dirección agregada exitosamente',
      direcciones: usuario.direcciones
    });

    console.log(`✅ Dirección agregada: ${usuario.email} - ${alias}`);

  } catch (error) {
    console.error('❌ Error agregando dirección:', error);
    
    if (error.name === 'ValidationError') {
      const campos = Object.keys(error.errors);
      return res.status(400).json({
        success: false,
        mensaje: 'Datos de dirección inválidos',
        errores: campos.map(campo => ({
          campo,
          mensaje: error.errors[campo].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * ✏️ ACTUALIZAR DIRECCIÓN
 */
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Buscar la dirección
    const direccion = usuario.direcciones.id(addressId);
    
    if (!direccion) {
      return res.status(404).json({
        success: false,
        mensaje: 'Dirección no encontrada'
      });
    }

    // Actualizar campos proporcionados
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        direccion[key] = updateData[key];
      }
    });

    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Dirección actualizada exitosamente',
      direccion
    });

    console.log(`✅ Dirección actualizada: ${usuario.email} - ${direccion.alias}`);

  } catch (error) {
    console.error('❌ Error actualizando dirección:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 🗑️ ELIMINAR DIRECCIÓN
 */
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Buscar la dirección
    const direccion = usuario.direcciones.id(addressId);
    
    if (!direccion) {
      return res.status(404).json({
        success: false,
        mensaje: 'Dirección no encontrada'
      });
    }

    // No permitir eliminar si es la única dirección
    if (usuario.direcciones.length === 1) {
      return res.status(400).json({
        success: false,
        mensaje: 'No puedes eliminar tu única dirección'
      });
    }

    const esEraPrincipal = direccion.esPrincipal;
    const alias = direccion.alias;

    // Eliminar dirección
    direccion.remove();

    // Si era principal, marcar otra como principal
    if (esEraPrincipal && usuario.direcciones.length > 0) {
      usuario.direcciones[0].esPrincipal = true;
    }

    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Dirección eliminada exitosamente',
      direcciones: usuario.direcciones
    });

    console.log(`✅ Dirección eliminada: ${usuario.email} - ${alias}`);

  } catch (error) {
    console.error('❌ Error eliminando dirección:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 📊 OBTENER ESTADÍSTICAS DEL USUARIO
 */
const getUserStats = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Estadísticas básicas del usuario
    const estadisticasBasicas = usuario.estadisticas;

    // Calcular estadísticas adicionales
    const fechaRegistro = usuario.fechaRegistro;
    const diasDesdeRegistro = Math.floor((new Date() - fechaRegistro) / (1000 * 60 * 60 * 24));
    
    const promedioAhorroPorCompra = estadisticasBasicas.totalCompras > 0 
      ? estadisticasBasicas.totalAhorro / estadisticasBasicas.totalCompras 
      : 0;

    res.json({
      success: true,
      estadisticas: {
        ...estadisticasBasicas,
        diasDesdeRegistro,
        promedioAhorroPorCompra: Math.round(promedioAhorroPorCompra * 100) / 100,
        direccionesGuardadas: usuario.direcciones.length,
        direccionPrincipal: usuario.getDireccionPrincipal()
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 📧 VERIFICAR EMAIL
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // En una implementación real, verificarías el token de verificación
    // Por ahora, simulamos que el email está verificado
    
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    usuario.emailVerificado = true;
    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Email verificado exitosamente'
    });

    console.log(`✅ Email verificado: ${usuario.email}`);

  } catch (error) {
    console.error('❌ Error verificando email:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 🗑️ ELIMINAR CUENTA
 */
const deleteAccount = async (req, res) => {
  try {
    const { password, motivo } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Contraseña es obligatoria para eliminar la cuenta'
      });
    }

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña
    const esPasswordValido = await usuario.compararPassword(password);
    
    if (!esPasswordValido) {
      return res.status(401).json({
        success: false,
        mensaje: 'Contraseña incorrecta'
      });
    }

    // Cambiar estado a inactivo en lugar de eliminar
    usuario.estado = 'inactivo';
    
    // Guardar motivo si se proporciona
    if (motivo) {
      usuario.motivoEliminacion = motivo;
      usuario.fechaEliminacion = new Date();
    }

    await usuario.save();

    res.json({
      success: true,
      mensaje: 'Cuenta desactivada exitosamente'
    });

    console.log(`⚠️ Cuenta desactivada: ${usuario.email} (${usuario._id}) - Motivo: ${motivo || 'No especificado'}`);

  } catch (error) {
    console.error('❌ Error eliminando cuenta:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * 🔄 RECUPERAR CONTRASEÑA (enviar email)
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validationUtils.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email válido es requerido'
      });
    }

    const usuario = await User.findOne({ email: email.toLowerCase() });
    
    // Por seguridad, siempre respondemos que el email fue enviado
    // aunque el usuario no exista
    res.json({
      success: true,
      mensaje: 'Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña'
    });

    if (usuario && usuario.estado === 'activo') {
      // Aquí implementarías el envío de email de recuperación
      // Por ahora solo logueamos
      console.log(`📧 Solicitud de recuperación de contraseña: ${email}`);
      
      // En una implementación real:
      // 1. Generar token de recuperación
      // 2. Guardar token en BD con expiración
      // 3. Enviar email con link de recuperación
    }

  } catch (error) {
    console.error('❌ Error solicitando recuperación:', error);
    
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserStats,
  verifyEmail,
  deleteAccount,
  requestPasswordReset
};