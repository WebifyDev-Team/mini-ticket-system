require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

console.log('🔗  MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✔️  MongoDB connected to database:', mongoose.connection.name);
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/tickets', require('./routes/tickets'));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`🚀  Server running on port ${port}`));
  })
  .catch(err => {
    console.error('❌  Mongo connection error:', err);
    process.exit(1);
  });
