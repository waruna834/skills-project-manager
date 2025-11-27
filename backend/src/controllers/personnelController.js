const db = require('../config/db');

/* ===========================================================
   GET ALL PERSONNEL + THEIR SKILLS
   =========================================================== */
exports.getAllPersonnel = async (req, res) => {
  try {
    // Get all personnel
    const [personnel] = await db.query(
      'SELECT * FROM personnel ORDER BY created_at DESC'
    );

    // Get all skills related to personnel
    const [skills] = await db.query(`
      SELECT 
        ps.personnel_id,
        s.id AS skill_id,
        s.name AS skill_name,
        ps.proficiency_level
      FROM personnel_skills ps
      JOIN skills s ON ps.skill_id = s.id
    `);

    // Merge skills into personnel
    const personnelWithSkills = personnel.map(p => ({
      ...p,
      skills_list: skills.filter(s => s.personnel_id === p.id)
    }));

    res.json(personnelWithSkills);
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   GET SINGLE PERSONNEL BY ID
   =========================================================== */
exports.getPersonnelById = async (req, res) => {
  try {
    const [personnel] = await db.query(
      'SELECT * FROM personnel WHERE id = ?',
      [req.params.id]
    );

    if (personnel.length === 0) {
      return res.status(404).json({ message: 'Personnel not found' });
    }

    const [skills] = await db.query(`
      SELECT 
        ps.skill_id,
        s.name AS skill_name,
        ps.proficiency_level
      FROM personnel_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.personnel_id = ?
    `, [req.params.id]);

    res.json({
      ...personnel[0],
      skills_list: skills
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   CREATE PERSONNEL + MULTIPLE SKILLS
   =========================================================== */
exports.createPersonnel = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const { name, role, experience_level, email, skills } = req.body;

    // Insert personnel
    const [result] = await conn.query(
      `INSERT INTO personnel (name, role, experience_level, email)
       VALUES (?, ?, ?, ?)`,
      [name, role, experience_level, email]
    );

    const personnelId = result.insertId;

    // Insert skills (if any)
    if (skills && skills.length > 0) {
      for (const s of skills) {
        await conn.query(
          `INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level)
           VALUES (?, ?, ?)`,
          [personnelId, s.skill_id, s.proficiency_level]
        );
      }
    }

    await conn.commit();

    res.status(201).json({
      id: personnelId,
      message: "Personnel created successfully"
    });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};

/* ===========================================================
   UPDATE PERSONNEL + SKILLS
   =========================================================== */
exports.updatePersonnel = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const { name, role, experience_level, email, skills } = req.body;
    const personnelId = req.params.id;

    // Update personnel main info
    await conn.query(
      `UPDATE personnel SET name = ?, role = ?, experience_level = ?, email = ?
       WHERE id = ?`,
      [name, role, experience_level, email, personnelId]
    );

    // Remove old skills
    await conn.query(
      `DELETE FROM personnel_skills WHERE personnel_id = ?`,
      [personnelId]
    );

    // Insert updated skill list
    if (skills && skills.length > 0) {
      for (const s of skills) {
        await conn.query(
          `INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level)
           VALUES (?, ?, ?)`,
          [personnelId, s.skill_id, s.proficiency_level]
        );
      }
    }

    await conn.commit();

    res.json({ message: "Personnel updated successfully" });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};

/* ===========================================================
   DELETE PERSONNEL
   =========================================================== */
exports.deletePersonnel = async (req, res) => {
  try {
    await db.query('DELETE FROM personnel WHERE id = ?', [req.params.id]);
    res.json({ message: "Personnel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
