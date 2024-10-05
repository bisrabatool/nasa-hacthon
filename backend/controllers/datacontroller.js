const Data = require('../models/Data');
  exports.getData = async (req, res) => {
    try {
      const userData = await Data.findOne({ userId: req.user.id });
      if (!userData) {
        return res.status(404).json({ message: 'Location not found' });
      }
      res.json([userData]);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.saveData = async (req, res) => {
    const { name, lat, lon, minlat, minlon, maxlat, maxlon  } = req.body;
  
    try {
      let userData = await Data.findOne({ userId: req.user.id });
      if (!userData) {
      
        userData = new Data({
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
       
        userData.name = name;
        userData.lat = lat;
        userData.lon = lon;
        userData.minlat = minlat;
        userData.minlon = minlon;
        userData.maxlat = maxlat;
        userData.maxlon = maxlon;
      }
      await userData.save();
  
      res.json({ message: 'Location saved' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };