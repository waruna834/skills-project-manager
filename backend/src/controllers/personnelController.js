const db = require('../config/db');

// Get all personnel
exports.getAllPersonnel = async (req, res) => {
  try {
    const [personnel] = await db.query('SELECT * FROM personnel ORDER BY created_at DESC');
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single personnel by ID
exports.getPersonnelById = async (req, res) => {
  try {
    const [personnel] = await db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id]);
    
    if (personnel.length === 0) {
      return res.status(404).json({ message: 'Personnel not found' });
    }

    // Get their skills
    const [skills] = await db.query(`
      SELECT s.id, s.name, s.category, ps.proficiency_level
      FROM personnel_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.personnel_id = ?
    `, [req.params.id]);

    res.json({ ...personnel[0], skills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new personnel
exports.createPersonnel = async (req, res) => {
  try {
    const { name, role, experience_level, email } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO personnel (name, role, experience_level, email) VALUES (?, ?, ?, ?)',
      [name, role, experience_level, email]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Personnel created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};