import React, { useState, useEffect } from 'react';
import { projectsAPI, skillsAPI } from '../services/api';
import { X, Plus } from 'lucide-react';

function ProjectForm({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planning',
    team_capacity: 5
  });
  const [skills, setSkills] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkills();
      if (editData) {
        setFormData({
          name: editData.name,
          description: editData.description || '',
          start_date: editData.start_date,
          end_date: editData.end_date,
          status: editData.status,
          team_capacity: editData.team_capacity
        });
      } else {
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        const endDate = threeMonthsLater.toISOString().split('T')[0];
        
        setFormData(prev => ({
          ...prev,
          start_date: today,
          end_date: endDate
        }));
      }
    }
  }, [isOpen, editData]);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await projectsAPI.update(editData.id, formData);
        alert('Project updated successfully!');
      } else {
        const result = await projectsAPI.create(formData);
        const projectId = result.data.id;
        
        // Add required skills
        for (const skill of requiredSkills) {
          if (skill.skill_id) {
            await projectsAPI.addRequiredSkill(projectId, skill);
          }
        }
        
        alert('Project created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const addRequiredSkill = () => {
    setRequiredSkills([...requiredSkills, { skill_id: '', required_proficiency: 3, priority: 'Must Have' }]);
  };

  const removeRequiredSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const updateRequiredSkill = (index, field, value) => {
    const updated = [...requiredSkills];
    updated[index][field] = field === 'required_proficiency' ? parseInt(value) : value;
    setRequiredSkills(updated);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{editData ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., E-Commerce Platform"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="Brief description of the project..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Team Capacity *</label>
              <input
                type="number"
                value={formData.team_capacity}
                onChange={(e) => setFormData({ ...formData, team_capacity: parseInt(e.target.value) })}
                required
                min="1"
                max="50"
              />
            </div>
          </div>

          {!editData && (
            <>
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Required Skills</h3>
                  <button type="button" className="btn btn-secondary" onClick={addRequiredSkill}>
                    <Plus size={16} />
                    Add Skill
                  </button>
                </div>
              </div>

              {requiredSkills.map((skill, index) => (
                <div key={index} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr 1fr auto', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <select
                    value={skill.skill_id}
                    onChange={(e) => updateRequiredSkill(index, 'skill_id', e.target.value)}
                    required
                  >
                    <option value="">Select Skill</option>
                    {skills.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>

                  <select
                    value={skill.required_proficiency}
                    onChange={(e) => updateRequiredSkill(index, 'required_proficiency', e.target.value)}
                    required
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </select>

                  <select
                    value={skill.priority}
                    onChange={(e) => updateRequiredSkill(index, 'priority', e.target.value)}
                    required
                  >
                    <option value="Must Have">Must Have</option>
                    <option value="Nice to Have">Nice to Have</option>
                  </select>

                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => removeRequiredSkill(index)}
                    style={{ padding: '0.5rem' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saving...' : (editData ? 'Update Project' : 'Create Project')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;