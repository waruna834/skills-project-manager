const db = require('../config/db');

// Personnel Growth Over Time
exports.getPersonnelGrowth = async (req, res) => {
  try {
    const { period } = req.query;
    
    let query;
    if (period === 'daily') {
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative
        FROM personnel
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
    } else {
      query = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count,
          SUM(COUNT(*)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) as cumulative
        FROM personnel
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `;
    }
    
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get utilization data
exports.getUtilization = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.role,
        COUNT(a.id) as active_projects,
        SUM(a.allocation_percentage) as total_allocation
      FROM personnel p
      LEFT JOIN allocations a ON p.id = a.personnel_id 
        AND a.allocation_end >= CURDATE()
      GROUP BY p.id
      ORDER BY total_allocation DESC
    `);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};