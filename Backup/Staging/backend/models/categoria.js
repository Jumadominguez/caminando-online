const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  filters: {
    "Tipo de producto": {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Categoria', categoriaSchema);