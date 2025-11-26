const db = require('../config/db');
const axios = require('axios');

const MATCHING_SERVICE_URL = process.env.MATCHING_SERVICE_URL || 'http://localhost:5001';

exports.findMatchesForProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Get project details
    const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const project = projects[0];
    
    // Get required skills for the project
    const [requiredSkills] = await db.query(`
      SELECT ps.skill_id, s.name as skill_name, s.category, ps.required_proficiency, ps.priority
      FROM project_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.project_id = ?
    `, [projectId]);
    
    if (requiredSkills.length === 0) {
      return res.status(400).json({ message: 'Project has no required skills defined' });
    }
    
    // Get all personnel with their skills
    const [personnel] = await db.query(`
      SELECT DISTINCT p.id, p.name, p.role, p.experience_level, p.email
      FROM personnel p
    `);
    
    // Get skills for each person
    for (let person of personnel) {
      const [skills] = await db.query(`
        SELECT ps.skill_id, s.name as skill_name, ps.proficiency_level
        FROM personnel_skills ps
        JOIN skills s ON ps.skill_id = s.id
        WHERE ps.personnel_id = ?
      `, [person.id]);
      person.skills = skills;
      
      // Get current allocations
      const [allocations] = await db.query(`
        SELECT a.*, pr.name as project_name
        FROM allocations a
        JOIN projects pr ON a.project_id = pr.id
        WHERE a.personnel_id = ? AND a.allocation_end >= CURDATE()
      `, [person.id]);
      person.allocations = allocations;
    }
    
    // Call matching service
    const matchingResponse = await axios.post(`${MATCHING_SERVICE_URL}/match`, {
      personnel,
      requiredSkills,
      projectStart: project.start_date,
      projectEnd: project.end_date,
      sortBy: req.query.sortBy || 'bestFit'
    });
    
    res.json({
      project: {
        id: project.id,
        name: project.name,
        start_date: project.start_date,
        end_date: project.end_date
      },
      ...matchingResponse.data
    });
    
  } catch (error) {
    console.error('Matching error:', error.message);
    res.status(500).json({ error: error.message });
  }
};