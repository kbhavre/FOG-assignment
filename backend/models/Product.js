const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
  },
  newTag: {
    type: Boolean,
  },
  oldPrice: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
});

module.exports = mongoose.model("Product", productSchema);
