const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    // required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
  roles: {
    type: [String],
    required: true,
  },
  current: {
    type: Boolean,
    default: false,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
