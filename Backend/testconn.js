require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('CONNECTED'))
  .catch(e => console.log('FULL ERROR:', e.message));