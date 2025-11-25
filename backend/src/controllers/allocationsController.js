const db = require('../config/db');

// Get all allocations
exports.getAllAllocations = async (req, res) => {
  try {
    const [allocations] = await db.query(`
      SELECT a.*, 
             p.name as personnel_name, p.role,
             pr.name as project_name
      FROM allocations a
      JOIN personnel p ON a.personnel_id = p.id
      JOIN projects pr ON a.project_id = pr.id
      ORDER BY a.allocation_start DESC
    `);
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new allocation
exports.createAllocation = async (req, res) => {
  try {
    const { project_id, personnel_id, allocation_start, allocation_end, allocation_percentage, status } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO allocations (project_id, personnel_id, allocation_start, allocation_end, allocation_percentage, status) VALUES (?, ?, ?, ?, ?, ?)',
      [project_id, personnel_id, allocation_start, allocation_end, allocation_percentage || 100, status || 'Proposed']
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Allocation created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update allocation
exports.updateAllocation = async (req, res) => {
  try {
    const { allocation_start, allocation_end, allocation_percentage, status } = req.body;
    
    await db.query(
      'UPDATE allocations SET allocation_start = ?, allocation_end = ?, allocation_percentage = ?, status = ? WHERE id = ?',
      [allocation_start, allocation_end, allocation_percentage, status, req.params.id]
    );

    res.json({ message: 'Allocation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete allocation
exports.deleteAllocation = async (req, res) => {
  try {
    await db.query('DELETE FROM allocations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by personnel
exports.getAllocationsByPersonnel = async (req, res) => {
  try {
    const [allocations] = await db.query(`
      SELECT a.*, pr.name as project_name, pr.status as project_status
      FROM allocations a
      JOIN projects pr ON a.project_id = pr.id
      WHERE a.personnel_id = ?
      ORDER BY a.allocation_start DESC
    `, [req.params.personnelId]);
    
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get allocations by project
exports.getAllocationsByProject = async (req, res) => {
  try {
    const [allocations] = await db.query(`
      SELECT a.*, 
             p.name as personnel_name, p.role, p.experience_level
      FROM allocations a
      JOIN personnel p ON a.personnel_id = p.id
      WHERE a.project_id = ?
      ORDER BY a.allocation_start
    `, [req.params.projectId]);
    
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};