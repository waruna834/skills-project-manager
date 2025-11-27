import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';
import { Award } from 'lucide-react';

function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(skills.map(s => s.category))];
  
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading">Loading skills...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Skills Catalog</h2>
        <p>Browse available skills by category</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              className={selectedCategory === category ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedSkills).map(category => (
        <div key={category} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>{category}</h3>
          <div className="skills-list">
            {groupedSkills[category].map(skill => (
              <span key={skill.id} className="skill-tag" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      {filteredSkills.length === 0 && (
        <div className="empty-state">
          <Award size={64} />
          <h3>No skills found</h3>
        </div>
      )}
    </div>
  );
}

export default SkillsList;