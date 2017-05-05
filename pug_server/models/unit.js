const mongoose = require('../connection');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  ip: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  unitType: {type: String, required: true},
  updateRate: {type: Number, default: 5},

  data: {type: String, required: true},
  regExp: {type: String, required: true},

  switcherOne: {
    name: {type: String},
    url: {type: String}
  },
  switcherTwo: {
    name: {type: String},
    url: {type: String}
  },

  created_at: Date,
  updated_at: Date
});

unitSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  next();
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;