const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');

router.get('/', skillsController.getAllSkills);
router.get('/:id', skillsController.getSkillById);
router.get('/category/:category', skillsController.getSkillsByCategory);
router.post('/', skillsController.createSkill);
router.put('/:id', skillsController.updateSkill);
router.delete('/:id', skillsController.deleteSkill);

module.exports = router;