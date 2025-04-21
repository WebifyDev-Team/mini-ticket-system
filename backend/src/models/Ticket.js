const { Schema, model } = require('mongoose');
const ticketSchema = new Schema({
  title: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: true },
  status: { type: String, enum: ['open','in_progress','closed'], default: 'open' }
}, { timestamps: true });
module.exports = model('Ticket', ticketSchema);
