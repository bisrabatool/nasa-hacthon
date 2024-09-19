const Location = require ('../models/Location')

exports.getLocation = async (req, res) => {
  try {
    const userLocation = await Location.findOne({ userId: req.user.id });
    if (!userLocation) return res.status(404).json({ message: 'User not found' });
    
    res.json([userLocation]); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveLocation = async (req, res) => {
  const { name, lat, lng } = req.body;

  try {
    let userLocation = await Location.findOne({ userId: req.user.id });
    if (!userLocation) {
      userLocation = new Location({ userId: req.user.id, name, lat, lon: lng });
    } else {
      userLocation.name = name;
      userLocation.lat = lat;
      userLocation.lon = lng;
    }
    await userLocation.save();

    res.json({ message: 'Location saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
