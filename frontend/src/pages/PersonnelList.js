import React, { useState, useEffect } from 'react';
import { personnelAPI } from '../services/api';
import { Users, Edit, Trash2, Search, Plus } from 'lucide-react';
import PersonnelForm from '../components/PersonnelForm';

function PersonnelList() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const response = await personnelAPI.getAll();
      setPersonnel(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await personnelAPI.delete(id);
        fetchPersonnel();
      } catch (error) {
        console.error('Error deleting personnel:', error);
        alert('Failed to delete personnel');
      }
    }
  };

  const handleEdit = (person) => {
    setEditingPersonnel(person);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingPersonnel(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPersonnel(null);
  };

  const handleFormSuccess = () => {
    fetchPersonnel();
  };

  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExperience =
      !filterExperience || person.experience_level === filterExperience;

    return matchesSearch && matchesExperience;
  });

  if (loading) {
    return <div className="loading">Loading personnel...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Personnel Management</h2>
            <p>Manage your team members and their skills</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <Plus size={20} /> Add Personnel
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20}
              style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#718096'
              }}
            />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            <option value="">All Experience Levels</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      <div className="card-grid">
        {filteredPersonnel.map(person => (
          <div key={person.id} className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem'
              }}
            >
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{person.name}</h3>
                <p style={{ color: '#718096', marginBottom: '0.5rem' }}>{person.role}</p>
                <span className={`badge badge-${person.experience_level.toLowerCase()}`}>
                  {person.experience_level}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem' }}
                  onClick={() => handleEdit(person)}
                >
                  <Edit size={16} />
                </button>

                <button
                  className="btn btn-danger"
                  style={{ padding: '0.5rem' }}
                  onClick={() => handleDelete(person.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>Skills:</h4>

              <div className="skills-list">
                {person.skills_list && person.skills_list.length > 0 ? (
                  person.skills_list.map((s, idx) => (
                    <span key={idx} className="skill-tag">
                      {s.skill_name} <span className="skill-level">({s.proficiency_level}/5)</span>
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#a0aec0', fontSize: '0.875rem' }}>No skills assigned</span>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#718096'
              }}
            >
              📧 {person.email || 'No email'}
            </div>
          </div>
        ))}
      </div>

      {filteredPersonnel.length === 0 && (
        <div className="empty-state">
          <Users size={64} />
          <h3>No personnel found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      <PersonnelForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editData={editingPersonnel}
      />
    </div>
  );
}

export default PersonnelList;
