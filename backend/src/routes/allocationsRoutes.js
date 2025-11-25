const express = require('express');
const router = express.Router();
const allocationsController = require('../controllers/allocationsController');

router.get('/', allocationsController.getAllAllocations);
router.post('/', allocationsController.createAllocation);
router.put('/:id', allocationsController.updateAllocation);
router.delete('/:id', allocationsController.deleteAllocation);
router.get('/personnel/:personnelId', allocationsController.getAllocationsByPersonnel);
router.get('/project/:projectId', allocationsController.getAllocationsByProject);

module.exports = router;