const express = require('express');
const { getData ,saveData } = require('../controllers/datacontroller');
const authenticate = require('../middleware/authenticate'); 

const router = express.Router();

router.get('/', authenticate, getData,);
router.post('/', authenticate, saveData);


module.exports = router;
