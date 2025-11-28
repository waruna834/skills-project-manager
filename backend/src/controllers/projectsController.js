const db = require('../config/db');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT p.*,
             COUNT(DISTINCT a.personnel_id) as current_team_size
      FROM projects p
      LEFT JOIN allocations a ON p.id = a.project_id AND a.status IN ('Proposed', 'Confirmed')
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // Get team members for each project
    for (let project of projects) {
      const [team] = await db.query(`
        SELECT 
          per.id,
          per.name,
          per.role,
          per.experience_level,
          a.allocation_percentage,
          a.status as allocation_status
        FROM allocations a
        JOIN personnel per ON a.personnel_id = per.id
        WHERE a.project_id = ? AND a.status IN ('Proposed', 'Confirmed')
        ORDER BY a.created_at
      `, [project.id]);
      
      project.team = team;
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get project by ID with details
exports.getProjectById = async (req, res) => {
  try {
    const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get required skills
    const [requiredSkills] = await db.query(`
      SELECT s.id, s.name, s.category, ps.required_proficiency, ps.priority
      FROM project_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.project_id = ?
    `, [req.params.id]);

    // Get allocated team
    const [team] = await db.query(`
      SELECT p.id, p.name, p.role, p.experience_level,
             a.allocation_start, a.allocation_end, a.allocation_percentage, a.status
      FROM allocations a
      JOIN personnel p ON a.personnel_id = p.id
      WHERE a.project_id = ?
    `, [req.params.id]);

    res.json({ 
      ...project[0], 
      requiredSkills,
      team 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status, team_capacity } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO projects (name, description, start_date, end_date, status, team_capacity) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, start_date, end_date, status, team_capacity]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Project created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status, team_capacity } = req.body;
    
    await db.query(
      'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, team_capacity = ? WHERE id = ?',
      [name, description, start_date, end_date, status, team_capacity, req.params.id]
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add required skill to project
exports.addRequiredSkill = async (req, res) => {
  try {
    const { skill_id, required_proficiency, priority } = req.body;
    
    await db.query(
      'INSERT INTO project_skills (project_id, skill_id, required_proficiency, priority) VALUES (?, ?, ?, ?)',
      [req.params.id, skill_id, required_proficiency, priority || 'Must Have']
    );

    res.status(201).json({ message: 'Skill requirement added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};