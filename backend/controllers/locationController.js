const Location = require('../models/Location');

exports.getLocation = async (req, res) => {
  try {
    const userLocation = await Location.findOne({ userId: req.user.id });
    if (!userLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json([userLocation]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveLocation = async (req, res) => {
  const { name, lat, lon, minlat, minlon, maxlat, maxlon  } = req.body;

  try {
    let userLocation = await Location.findOne({ userId: req.user.id });
    if (!userLocation) {
    
      userLocation = new Location({
        userId: req.user.id,
        name,
        lat,
        lon,
        minlat,
        minlon,
        maxlat,
        maxlon,
  
      });
    } else {
     
      userLocation.name = name;
      userLocation.lat = lat;
      userLocation.lon = lon;
      userLocation.minlat = minlat;
      userLocation.minlon = minlon;
      userLocation.maxlat = maxlat;
      userLocation.maxlon = maxlon;
    }
    await userLocation.save();

    res.json({ message: 'Location saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




