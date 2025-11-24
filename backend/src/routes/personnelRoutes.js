const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnelController');

router.get('/', personnelController.getAllPersonnel);
router.get('/:id', personnelController.getPersonnelById);
router.post('/', personnelController.createPersonnel);

module.exports = router;