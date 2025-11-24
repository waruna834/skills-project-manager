-- Skills Management System - Database Schema

DROP DATABASE IF EXISTS skills_management;
CREATE DATABASE skills_management;
USE skills_management;

-- Personnel Table
CREATE TABLE personnel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    experience_level ENUM('Junior', 'Mid', 'Senior') NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Catalog Table
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personnel Skills (Junction Table with Proficiency)
CREATE TABLE personnel_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personnel_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    years_experience DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_personnel_skill (personnel_id, skill_id)
);

-- Projects Table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Planning', 'Active', 'Completed') DEFAULT 'Planning',
    team_capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Required Skills
CREATE TABLE project_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_proficiency INT CHECK (required_proficiency BETWEEN 1 AND 5),
    priority ENUM('Must Have', 'Nice to Have') DEFAULT 'Must Have',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id)
);

-- Project Allocations
CREATE TABLE allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    personnel_id INT NOT NULL,
    allocation_start DATE NOT NULL,
    allocation_end DATE NOT NULL,
    allocation_percentage INT DEFAULT 100,
    status ENUM('Proposed', 'Confirmed', 'Completed') DEFAULT 'Proposed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX idx_personnel_experience ON personnel(experience_level);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_allocations_dates ON allocations(allocation_start, allocation_end);
CREATE INDEX idx_personnel_created ON personnel(created_at);

-- Sample Data for Testing
INSERT INTO skills (name, category) VALUES
('Python', 'Programming Languages'),
('JavaScript', 'Programming Languages'),
('React', 'Frameworks'),
('Node.js', 'Frameworks'),
('Docker', 'Tools'),
('AWS', 'Cloud'),
('MySQL', 'Databases'),
('MongoDB', 'Databases'),
('Java', 'Programming Languages'),
('TypeScript', 'Programming Languages');

INSERT INTO personnel (name, role, experience_level, email, created_at) VALUES
('John Doe', 'Full Stack Developer', 'Senior', 'john@example.com', '2024-01-15'),
('Jane Smith', 'Frontend Developer', 'Mid', 'jane@example.com', '2024-02-20'),
('Bob Johnson', 'Backend Developer', 'Junior', 'bob@example.com', '2024-03-10'),
('Alice Williams', 'DevOps Engineer', 'Senior', 'alice@example.com', '2024-04-05'),
('Charlie Brown', 'Full Stack Developer', 'Mid', 'charlie@example.com', '2024-05-12');

INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES
(1, 1, 5), (1, 2, 5), (1, 3, 4), (1, 4, 5),
(2, 2, 4), (2, 3, 5), (2, 10, 4),
(3, 4, 3), (3, 7, 3), (3, 1, 2),
(4, 5, 5), (4, 6, 4), (4, 7, 4),
(5, 1, 4), (5, 4, 4), (5, 8, 3);

INSERT INTO projects (name, description, start_date, end_date, status, team_capacity) VALUES
('E-Commerce Platform', 'Build a full-stack e-commerce solution', '2024-12-01', '2025-03-31', 'Planning', 5),
('Mobile App Backend', 'REST API for mobile application', '2024-11-15', '2025-02-28', 'Active', 3),
('Cloud Migration', 'Migrate legacy systems to AWS', '2025-01-01', '2025-06-30', 'Planning', 4);

INSERT INTO project_skills (project_id, skill_id, required_proficiency, priority) VALUES
(1, 2, 4, 'Must Have'), (1, 3, 4, 'Must Have'), (1, 4, 4, 'Must Have'),
(2, 4, 4, 'Must Have'), (2, 7, 3, 'Must Have'), (2, 1, 3, 'Nice to Have'),
(3, 5, 4, 'Must Have'), (3, 6, 4, 'Must Have'), (3, 7, 3, 'Must Have');