const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  addedAt: {
  type: Date,
  default: Date.now
  },
  price: Number
}
);

module.exports = mongoose.model("Product", productSchema);
