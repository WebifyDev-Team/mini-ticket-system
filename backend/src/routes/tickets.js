const router = require('express').Router();
const Ticket = require('../models/Ticket');
const Joi    = require('joi');

const schema = Joi.object({
  title:       Joi.string().max(255).required(),
  description: Joi.string().required(),
  status:      Joi.string().valid('open','in_progress','closed')
}).options({ allowUnknown: false }); 

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const ticket = await Ticket.create(value);
    return res.status(201).json(ticket);
  } catch (err) {
    console.error('❌ Error creating ticket:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const tickets = await Ticket.find(filter);
  res.json(tickets);
});

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.sendStatus(404);
  res.json(ticket);
});


router.put('/:id', async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!ticket) return res.sendStatus(404);
    return res.json(ticket);
  } catch (err) {
    console.error('❌ Error updating ticket:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
