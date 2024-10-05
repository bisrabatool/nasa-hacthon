const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.googleLogin = async (req, res) => {
  try {
    const { id, email } = req.body; 
    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({ googleId: id, email });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_GOOGLE_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
