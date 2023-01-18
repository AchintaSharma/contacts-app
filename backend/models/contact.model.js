const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
  },
}, { _id: false, versionKey: false, timestamps: true });

module.exports = mongoose.model("contact", employeeSchema)