const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Utilidad: validar email
const esEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Registro
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    if (!esEmailValido(email)) {
      return res.status(400).json({ mensaje: 'Email inválido' });
    }

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El usuario ya existe' });

    const nuevoUsuario = new User({ nombre, email, password });
    await nuevoUsuario.save();

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET no definido');

    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el registro', error: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    if (!esEmailValido(email)) {
      return res.status(400).json({ mensaje: 'Email inválido' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET no definido');

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
};

module.exports = { registerUser, loginUser };