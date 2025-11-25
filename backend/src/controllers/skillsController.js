const db = require('../config/db');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY category, name');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const [skill] = await db.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    
    if (skill.length === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Get personnel who have this skill
    const [personnel] = await db.query(`
      SELECT p.id, p.name, p.role, ps.proficiency_level
      FROM personnel p
      JOIN personnel_skills ps ON p.id = ps.personnel_id
      WHERE ps.skill_id = ?
      ORDER BY ps.proficiency_level DESC
    `, [req.params.id]);

    res.json({ ...skill[0], personnel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO skills (name, category, description) VALUES (?, ?, ?)',
      [name, category, description]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Skill created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    await db.query(
      'UPDATE skills SET name = ?, category = ?, description = ? WHERE id = ?',
      [name, category, description, req.params.id]
    );

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get skills by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    const [skills] = await db.query(
      'SELECT * FROM skills WHERE category = ? ORDER BY name',
      [req.params.category]
    );
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};