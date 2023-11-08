const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    unique: true
  },
  categoryDescription: {
    type: String
  },
  categoryImage: {
    type: String
  },
  isVerified: Boolean
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
