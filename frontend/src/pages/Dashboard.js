import React, { useState, useEffect } from 'react';
import { personnelAPI, projectsAPI, skillsAPI } from '../services/api';
import { Users, Briefcase, Award, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPersonnel: 0,
    totalProjects: 0,
    totalSkills: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [personnelRes, projectsRes, skillsRes] = await Promise.all([
        personnelAPI.getAll(),
        projectsAPI.getAll(),
        skillsAPI.getAll()
      ]);

      const activeProjects = projectsRes.data.filter(p => p.status === 'Active').length;

      setStats({
        totalPersonnel: personnelRes.data.length,
        totalProjects: projectsRes.data.length,
        totalSkills: skillsRes.data.length,
        activeProjects
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your team and projects</p>
      </div>

      <div className="card-grid">
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Personnel</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalPersonnel}</h3>
            </div>
            <Users size={48} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Projects</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalProjects}</h3>
            </div>
            <Briefcase size={48} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Active Projects</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.activeProjects}</h3>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Skills</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalSkills}</h3>
            </div>
            <Award size={48} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => window.location.href = '/personnel'}>
            <Users size={20} />
            Manage Personnel
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/projects'}>
            <Briefcase size={20} />
            Manage Projects
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/matching'}>
            <TrendingUp size={20} />
            Match Personnel
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/analytics'}>
            <Award size={20} />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;