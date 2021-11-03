const express = require('express');
const router = express.Router();
const classesController = require('./classesController');

/* GET all Classes. */
router.get('/', classesController.classes);

router.post('/', classesController.addClass);

module.exports = router;
