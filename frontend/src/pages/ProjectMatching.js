import React, { useState, useEffect } from 'react';
import { projectsAPI, matchingAPI } from '../services/api';
import { Target, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function ProjectMatching() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('bestFit');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleMatch = async () => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }

    setLoading(true);
    try {
      const response = await matchingAPI.findMatches(selectedProject, sortBy);
      setMatches(response.data.matches || []);
      setLoading(false);
    } catch (error) {
      console.error('Error finding matches:', error);
      alert('Failed to find matches');
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status.includes('Excellent') || status.includes('Highly')) {
      return <CheckCircle size={20} color="#10b981" />;
    } else if (status.includes('Good') || status.includes('Recommended')) {
      return <TrendingUp size={20} color="#3b82f6" />;
    } else if (status.includes('Partial')) {
      return <AlertCircle size={20} color="#f59e0b" />;
    } else {
      return <XCircle size={20} color="#ef4444" />;
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Smart Personnel Matching</h2>
        <p>Find the best candidates for your projects</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Choose a project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="bestFit">Best Overall Fit</option>
              <option value="matchPercentage">Skill Match %</option>
              <option value="availability">Availability</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleMatch}
              disabled={loading}
              style={{ width: '100%' }}
            >
              <Target size={20} />
              {loading ? 'Matching...' : 'Find Matches'}
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Analyzing candidates...</div>}

      {!loading && matches.length > 0 && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f0f9ff' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Match Summary</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <strong>Total Candidates:</strong> {matches.length}
              </div>
              <div>
                <strong>Perfect Matches:</strong> {matches.filter(m => m.matchPercentage === 100 && m.available).length}
              </div>
              <div>
                <strong>Available:</strong> {matches.filter(m => m.available).length}
              </div>
            </div>
          </div>

          {matches.map((match, idx) => (
            <div key={match.personnel_id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: idx === 0 ? '#fbbf24' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#e5e7eb',
                      color: idx < 3 ? 'white' : '#4b5563',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {idx + 1}
                    </span>
                    <h3 style={{ margin: 0 }}>{match.name}</h3>
                    <span className={`badge badge-${match.experience_level.toLowerCase()}`}>
                      {match.experience_level}
                    </span>
                  </div>
                  <p style={{ color: '#718096', fontSize: '0.875rem' }}>{match.role}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                    {match.overallScore}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    Overall Score
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
                    Skill Match
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: match.matchPercentage === 100 ? '#10b981' : match.matchPercentage >= 75 ? '#3b82f6' : '#f59e0b' }}>
                    {match.matchPercentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    {match.matchedSkills}/{match.totalRequired} skills
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
                    Availability
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: match.available ? '#10b981' : '#ef4444' }}>
                    {match.available ? 'Available' : 'Busy'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    {match.utilizationPercentage}% utilized
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem', 
                background: match.recommendation.includes('Excellent') ? '#d1fae5' : 
                           match.recommendation.includes('Good') ? '#dbeafe' : 
                           match.recommendation.includes('Partial') ? '#fef3c7' : '#fee2e2',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {getStatusIcon(match.recommendation)}
                <strong>{match.recommendation}</strong>
              </div>

              {match.missingSkills && match.missingSkills.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                    ⚠️ Missing Skills:
                  </div>
                  <div className="skills-list">
                    {match.missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        {skill.skill_name} (need: {skill.required_proficiency})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && selectedProject && (
        <div className="empty-state">
          <Target size={64} />
          <h3>No matches found</h3>
          <p>Try selecting a different project</p>
        </div>
      )}
    </div>
  );
}

export default ProjectMatching;