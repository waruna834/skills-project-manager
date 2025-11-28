# 🎯 Skills & Project Management System

A full-stack web application for managing personnel skills, tracking project requirements, and intelligently matching team members to projects using microservice architecture.

## ✨ Features

### Core Features
- ✅ **Personnel Management** - Complete CRUD operations for team members with experience levels (Junior, Mid, Senior)
- ✅ **Skills Catalog** - Categorized skill library with 1-5 proficiency tracking
- ✅ **Project Management** - Create and manage projects with required skills, dates, and team capacity
- ✅ **Smart Matching Algorithm** - Intelligent personnel-to-project matching based on:
  - Required skills and proficiency levels
  - Personnel availability and current allocations
  - Experience level bonuses
  - Overall fit scoring
- ✅ **Team Allocation** - Assign personnel to projects with date ranges and utilization tracking

### Advanced Features
- 🎯 **Microservice Architecture** - Separate matching service demonstrating service decoupling
- 🔍 **Advanced Search & Filtering** - Search personnel by skills, experience, and proficiency
- 📊 **Utilization Visualization** - Charts showing personnel workload and capacity
- 📈 **Historical Growth Analytics** - Track team expansion with daily/monthly growth charts
- 🌐 **RESTful APIs** - Comprehensive API endpoints for all operations
- 🐳 **Docker Support** - Full containerization for easy deployment

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js & Express.js** - Server framework
- **MySQL 8.0** - Relational database
- **Axios** - Inter-service communication
- **RESTful API** - Standard API architecture

### Microservice
- **Node.js** - Matching algorithm service
- **Express.js** - Lightweight API framework

### DevOps
- **Docker & Docker Compose** - Containerization
- **MySQL Official Image** - Database container
- **Multi-stage builds** - Optimized containers

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│                    Port: 3000 / 80                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├──────────────┬──────────────────┐
                 │              │                  │
        ┌────────▼──────┐  ┌───▼─────────┐  ┌────▼──────────┐
        │ Main Backend  │  │  Matching   │  │    MySQL      │
        │   (Express)   │──│  Service    │  │   Database    │
        │  Port: 5000   │  │ Port: 5001  │  │  Port: 3306   │
        └───────────────┘  └─────────────┘  └───────────────┘
```

**Key Design Patterns:**
- Microservice separation for matching logic
- RESTful API design
- Database normalization with proper foreign keys
- Stateless service architecture

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MySQL** v8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/))
- **Docker & Docker Compose** (Optional, for containerized setup)

---

### Option 1: Manual Setup

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/skills-project-manager.git
cd skills-project-manager
```

#### 2️⃣ Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Import schema
source database/schema.sql
```

Or:
```bash
mysql -u root -p < database/schema.sql
```

#### 3️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=skills_management
PORT=5000
MATCHING_SERVICE_URL=http://localhost:5001
EOF

# Start backend
npm run dev
```

Backend runs on: **http://localhost:5000**

#### 4️⃣ Matching Service Setup
```bash
cd matching-service
npm install

# Start service
npm run dev
```

Matching service runs on: **http://localhost:5001**

#### 5️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm start
```

Frontend runs on: **http://localhost:3000**

---


## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Personnel Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/personnel` | Get all personnel |
| `GET` | `/personnel/:id` | Get personnel by ID with skills |
| `GET` | `/personnel/search?skill=React&min_proficiency=3` | Search with filters |
| `POST` | `/personnel` | Create new personnel |
| `PUT` | `/personnel/:id` | Update personnel |
| `DELETE` | `/personnel/:id` | Delete personnel |
| `POST` | `/personnel/:id/skills` | Add skill to personnel |

**Example: Create Personnel**
```bash
curl -X POST http://localhost:5000/api/personnel \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "role": "Full Stack Developer",
    "experience_level": "Senior",
    "email": "john@example.com"
  }'
```

### Skills Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/skills` | Get all skills |
| `GET` | `/skills/:id` | Get skill by ID |
| `POST` | `/skills` | Create new skill |
| `PUT` | `/skills/:id` | Update skill |
| `DELETE` | `/skills/:id` | Delete skill |

### Projects Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects` | Get all projects |
| `GET` | `/projects/:id` | Get project by ID |
| `POST` | `/projects` | Create new project |
| `PUT` | `/projects/:id` | Update project |
| `DELETE` | `/projects/:id` | Delete project |
| `POST` | `/projects/:id/skills` | Add required skill |

### Matching Endpoint (⭐ Key Feature)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/match/project/:id?sortBy=bestFit` | Find matches for project |

**Sort Options:** `bestFit`, `matchPercentage`, `availability`

**Example Response:**
```json
{
  "project": {
    "id": 1,
    "name": "E-Commerce Platform"
  },
  "matches": [
    {
      "personnel_id": 1,
      "name": "John Doe",
      "matchPercentage": 100,
      "overallScore": 445,
      "available": true,
      "recommendation": "Excellent Match - Highly Recommended"
    }
  ],
  "summary": {
    "totalCandidates": 5,
    "perfectMatches": 2
  }
}
```

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/personnel-growth?period=monthly` | Get growth data |
| `GET` | `/analytics/utilization` | Get utilization data |

---