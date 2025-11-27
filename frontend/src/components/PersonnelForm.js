import React, { useState, useEffect } from 'react';
import { personnelAPI, skillsAPI } from '../services/api';
import { X, Plus } from 'lucide-react';

function PersonnelForm({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience_level: 'Junior',
    email: ''
  });

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    fetchSkills();

    if (editData) {
      setFormData({
        name: editData.name,
        role: editData.role,
        experience_level: editData.experience_level,
        email: editData.email || ''
      });

      if (editData.skills_list) {
        setSelectedSkills(
          editData.skills_list.map(s => ({
            skill_id: s.skill_id,
            proficiency_level: s.proficiency_level
          }))
        );
      }
    } else {
      setSelectedSkills([]);
      setFormData({
        name: '',
        role: '',
        experience_level: 'Junior',
        email: ''
      });
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

  const addSkill = () => {
    setSelectedSkills([...selectedSkills, { skill_id: '', proficiency_level: 3 }]);
  };

  const removeSkill = (index) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, field, value) => {
    const updated = [...selectedSkills];
    updated[index][field] =
      field === 'proficiency_level' ? parseInt(value) : value;
    setSelectedSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      skills: selectedSkills
    };

    try {
      if (editData) {
        await personnelAPI.update(editData.id, payload);
      } else {
        await personnelAPI.create(payload);
      }

      alert(editData ? 'Personnel updated!' : 'Personnel created!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving personnel:', error);
      alert('Failed to save personnel: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <h2>{editData ? 'Edit Personnel' : 'Add New Personnel'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Role/Title *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Experience Level *</label>
            <select
              value={formData.experience_level}
              onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
              required
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Skills Section for BOTH add & edit */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Skills</h3>
              <button type="button" className="btn btn-secondary" onClick={addSkill}>
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </div>

          {selectedSkills.map((skill, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr auto',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}
            >
              <select
                value={skill.skill_id}
                onChange={(e) => updateSkill(index, 'skill_id', e.target.value)}
                required
              >
                <option value="">Select Skill</option>
                {skills.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={skill.proficiency_level}
                onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                required
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Basic</option>
                <option value="3">3 - Intermediate</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSkill(index)}
                style={{ padding: '0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saving...' : editData ? 'Update' : 'Create'}
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

export default PersonnelForm;
