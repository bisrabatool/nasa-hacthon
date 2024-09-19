const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const locationRoutes = require('./routes/locationRoutes.js');
const authenticate = require('./middleware/authenticate.js');
require('./config/passport')(passport);



const app = express();
app.use(express.json());
app.use(cors());

app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/auth', authRoutes);
app.use('/locations', authenticate, locationRoutes); 

app.listen(5000, () => console.log('Server running on port 5000'));
