const express = require('express');
const { getLocation, saveLocation } = require('../controllers/locationController');
const authenticate = require('../middleware/authenticate'); 

const router = express.Router();

router.get('/', authenticate, getLocation,);
router.post('/', authenticate, saveLocation);


module.exports = router;
