import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import { Briefcase, Calendar, Users, Plus, Edit, Trash2 } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        alert('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Projects</h2>
            <p>Manage your projects and requirements</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <Plus size={20} />
            Add Project
          </button>
        </div>
      </div>

      <div className="card-grid">
        {projects.map(project => (
          <div key={project.id} className="card">
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', flex: 1 }}>{project.name}</h3>
                <span className={`badge badge-${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
              
              <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {project.description || 'No description provided'}
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '0.75rem', 
              fontSize: '0.875rem', 
              color: '#4a5568',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                <span>
                  <strong>Start:</strong> {formatDate(project.start_date)}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                <span>
                  <strong>End:</strong> {formatDate(project.end_date)}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} />
                <span>
                  <strong>Team:</strong> {project.current_team_size || 0} / {project.team_capacity}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => window.location.href = '/matching'}
              >
                Find Matches
              </button>
              
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.75rem' }}
                onClick={() => handleEdit(project)}
                title="Edit Project"
              >
                <Edit size={16} />
              </button>
              
              <button 
                className="btn btn-danger" 
                style={{ padding: '0.75rem' }}
                onClick={() => handleDelete(project.id)}
                title="Delete Project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <Briefcase size={64} />
          <h3>No projects found</h3>
          <p>Start by creating a new project</p>
          <button 
            className="btn btn-primary" 
            onClick={handleAddNew}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} />
            Create Your First Project
          </button>
        </div>
      )}

      <ProjectForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editData={editingProject}
      />
    </div>
  );
}

export default ProjectsList;