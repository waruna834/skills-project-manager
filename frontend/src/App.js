import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import pages (we'll create these next)
import Dashboard from './pages/Dashboard';
import PersonnelList from './pages/PersonnelList';
import ProjectsList from './pages/ProjectsList';
import SkillsList from './pages/SkillsList';
import ProjectMatching from './pages/ProjectMatching';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>Skills & Project Manager</h1>
            <ul className="nav-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/personnel">Personnel</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/matching">Matching</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
            </ul>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/personnel" element={<PersonnelList />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/skills" element={<SkillsList />} />
          <Route path="/matching" element={<ProjectMatching />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;