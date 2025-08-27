/* =====================================================
   👤 MODELO DE USUARIO EXPANDIDO - User.js
   ===================================================== */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-esquema para direcciones
const direccionSchema = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  calle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  numero: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  piso: {
    type: String,
    trim: true,
    maxlength: 10
  },
  departamento: {
    type: String,
    trim: true,
    maxlength: 10
  },
  codigoPostal: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  localidad: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  provincia: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  pais: {
    type: String,
    default: 'Argentina',
    maxlength: 50
  },
  coordenadas: {
    lat: Number,
    lng: Number
  },
  contacto: {
    nombre: {
      type: String,
      trim: true,
      maxlength: 100
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: 20
    },
    instrucciones: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  esPrincipal: {
    type: Boolean,
    default: false
  },
  activa: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Esquema principal del usuario
const userSchema = new mongoose.Schema({
  // Datos básicos
  nombre: {
    type: String,
    required: [true, 'Nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'Nombre muy largo']
  },
  apellido: {
    type: String,
    required: [true, 'Apellido es obligatorio'],
    trim: true,
    maxlength: [50, 'Apellido muy largo']
  },
  email: {
    type: String,
    required: [true, 'Email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Contraseña es obligatoria'],
    minlength: [8, 'Contraseña muy corta']
  },
  telefono: {
    type: String,
    required: [true, 'Teléfono es obligatorio'],
    trim: true,
    maxlength: [20, 'Teléfono muy largo']
  },
  dni: {
    type: String,
    required: [true, 'DNI es obligatorio'],
    trim: true,
    unique: true,
    match: [/^\d{7,8}$/, 'DNI inválido']
  },
  fechaNacimiento: {
    type: Date
  },

  // Estado del usuario
  estado: {
    type: String,
    enum: ['activo', 'suspendido', 'pendiente', 'inactivo'],
    default: 'activo'
  },
  emailVerificado: {
    type: Boolean,
    default: false
  },
  telefonoVerificado: {
    type: Boolean,
    default: false
  },

  // Direcciones embebidas
  direcciones: [direccionSchema],

  // Configuraciones del usuario
  configuraciones: {
    notificaciones: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      ofertas: {
        type: Boolean,
        default: true
      }
    },
    privacidad: {
      compartirDatos: {
        type: Boolean,
        default: false
      },
      recibirMarketing: {
        type: Boolean,
        default: false
      }
    },
    supermercados: {
      preferenciaEntrega: {
        type: String,
        enum: ['rapida', 'economica', 'eco_friendly'],
        default: 'economica'
      },
      notificarPromociones: {
        type: Boolean,
        default: true
      }
    }
  },

  // Metadatos
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  },
  ipRegistro: {
    type: String,
    trim: true
  },
  
  // Estadísticas del usuario
  estadisticas: {
    totalCompras: {
      type: Number,
      default: 0
    },
    totalAhorro: {
      type: Number,
      default: 0
    },
    supermercadoFavorito: {
      type: String,
      trim: true
    },
    ultimaCompra: {
      type: Date
    }
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'usuarios'
});

// Índices para optimizar consultas
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ dni: 1 }, { unique: true });
userSchema.index({ estado: 1 });
userSchema.index({ fechaRegistro: -1 });

// Middleware para encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada
  if (!this.isModified('password')) return next();

  try {
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para actualizar ultimoAcceso
userSchema.pre('findOneAndUpdate', function() {
  this.set({ ultimoAcceso: new Date() });
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.getDatosPublicos = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    telefono: this.telefono,
    estado: this.estado,
    emailVerificado: this.emailVerificado,
    fechaRegistro: this.fechaRegistro,
    configuraciones: this.configuraciones,
    estadisticas: this.estadisticas
  };
};

// Método para agregar dirección
userSchema.methods.agregarDireccion = function(nuevaDireccion) {
  // Si es la primera dirección, marcarla como principal
  if (this.direcciones.length === 0) {
    nuevaDireccion.esPrincipal = true;
  }
  
  // Si se marca como principal, desmarcar las demás
  if (nuevaDireccion.esPrincipal) {
    this.direcciones.forEach(dir => {
      dir.esPrincipal = false;
    });
  }
  
  this.direcciones.push(nuevaDireccion);
  return this.save();
};

// Método para obtener dirección principal
userSchema.methods.getDireccionPrincipal = function() {
  return this.direcciones.find(dir => dir.esPrincipal && dir.activa);
};

// Método para actualizar estadísticas de compra
userSchema.methods.actualizarEstadisticas = function(montoCompra, ahorro, supermercado) {
  this.estadisticas.totalCompras += 1;
  this.estadisticas.totalAhorro += ahorro;
  this.estadisticas.ultimaCompra = new Date();
  
  // Actualizar supermercado favorito (simple: el último usado)
  if (supermercado) {
    this.estadisticas.supermercadoFavorito = supermercado;
  }
  
  return this.save();
};

// Método estático para buscar por email o DNI
userSchema.statics.buscarPorEmailODNI = function(emailODni) {
  return this.findOne({
    $or: [
      { email: emailODni.toLowerCase() },
      { dni: emailODni }
    ]
  });
};

// Método estático para obtener estadísticas generales
userSchema.statics.getEstadisticasGenerales = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsuarios: { $sum: 1 },
        usuariosActivos: {
          $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] }
        },
        totalCompras: { $sum: '$estadisticas.totalCompras' },
        totalAhorro: { $sum: '$estadisticas.totalAhorro' }
      }
    }
  ]);
};

// Virtual para nombre completo
userSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellido}`;
});

// Configurar virtuals en JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);