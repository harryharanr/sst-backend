const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');

const shiftSchema = new mongoose.Schema({
  date: {
      type: Date,
      required: true
  },
  shift: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
  }
});

const Shift = mongoose.model('Shift', shiftSchema);

function validateShift(shift) {
    const schema = {
      date: Joi.date(),
      shift: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(shift, schema);
}

exports.shiftSchema = shiftSchema;
exports.Shift = Shift; 
exports.validate = validateShift;