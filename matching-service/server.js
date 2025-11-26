const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { 
  calculateMatchScore, 
  checkAvailability, 
  getExperienceBonus 
} = require('./src/matchingAlgorithm');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

/**
 * Main Matching Endpoint
 * POST /match
 * 
 * Request Body:
 * {
 *   personnel: [...],      // Array of personnel with their skills
 *   requiredSkills: [...], // Array of required skills for project
 *   projectStart: "2024-12-01",
 *   projectEnd: "2025-03-31",
 *   sortBy: "bestFit"      // Options: bestFit, availability, matchPercentage
 * }
 */
app.post('/match', (req, res) => {
  try {
    const { personnel, requiredSkills, projectStart, projectEnd, sortBy } = req.body;
    
    // Validate input
    if (!personnel || !requiredSkills || !projectStart || !projectEnd) {
      return res.status(400).json({ 
        error: 'Missing required fields: personnel, requiredSkills, projectStart, projectEnd' 
      });
    }
    
    console.log(`Matching ${personnel.length} personnel against ${requiredSkills.length} required skills`);
    
    // Calculate match for each person
    const matches = personnel.map(person => {
      // Calculate skill match
      const matchScore = calculateMatchScore(person.skills, requiredSkills);
      
      // Check availability
      const availability = checkAvailability(
        person.allocations, 
        projectStart, 
        projectEnd
      );
      
      // Add experience bonus
      const experienceBonus = getExperienceBonus(person.experience_level);
      
      // Calculate overall score
      const baseScore = matchScore.totalScore + experienceBonus;
      const availabilityMultiplier = availability.available ? 1.0 : 0.3;
      const overallScore = Math.round(baseScore * availabilityMultiplier);
      
      return {
        personnel_id: person.id,
        name: person.name,
        role: person.role,
        experience_level: person.experience_level,
        experienceBonus,
        
        // Match details
        ...matchScore,
        
        // Availability details
        ...availability,
        
        // Final scores
        baseScore,
        overallScore,
        
        // Recommendation
        recommendation: getRecommendation(matchScore.matchPercentage, availability.available)
      };
    });
    
    // Sort results based on sortBy parameter
    let sortedMatches = [...matches];
    
    switch(sortBy) {
      case 'bestFit':
        sortedMatches.sort((a, b) => b.overallScore - a.overallScore);
        break;
      case 'availability':
        sortedMatches.sort((a, b) => a.utilizationPercentage - b.utilizationPercentage);
        break;
      case 'matchPercentage':
        sortedMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      default:
        sortedMatches.sort((a, b) => b.overallScore - a.overallScore);
    }
    
    // Generate summary
    const summary = {
      totalCandidates: matches.length,
      perfectMatches: matches.filter(m => m.matchPercentage === 100 && m.available).length,
      fullyQualified: matches.filter(m => m.matchPercentage === 100).length,
      partiallyQualified: matches.filter(m => m.matchPercentage >= 50 && m.matchPercentage < 100).length,
      available: matches.filter(m => m.available).length,
      topCandidate: sortedMatches[0] ? {
        name: sortedMatches[0].name,
        score: sortedMatches[0].overallScore,
        matchPercentage: sortedMatches[0].matchPercentage
      } : null
    };
    
    console.log(`Matching complete: ${summary.perfectMatches} perfect matches found`);
    
    res.json({
      success: true,
      matches: sortedMatches,
      summary,
      matchingCriteria: {
        requiredSkills: requiredSkills.length,
        projectDuration: calculateDuration(projectStart, projectEnd),
        sortedBy: sortBy || 'bestFit'
      }
    });
    
  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ 
      error: 'Matching failed', 
      message: error.message 
    });
  }
});

/**
 * Helper: Get recommendation text
 */
function getRecommendation(matchPercentage, available) {
  if (matchPercentage === 100 && available) {
    return 'Excellent Match - Highly Recommended';
  } else if (matchPercentage === 100 && !available) {
    return 'Perfect Skills - Limited Availability';
  } else if (matchPercentage >= 75 && available) {
    return 'Good Match - Recommended';
  } else if (matchPercentage >= 50) {
    return 'Partial Match - Consider with Training';
  } else {
    return 'Poor Match - Not Recommended';
  }
}

/**
 * Helper: Calculate project duration in days
 */
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Matching Service',
    version: '1.0.0',
    endpoints: ['/match', '/health']
  });
});

/**
 * Service info endpoint
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Skills Matching Microservice',
    description: 'Intelligent personnel-to-project matching based on skills, proficiency, and availability',
    version: '1.0.0',
    endpoints: {
      'POST /match': 'Match personnel to project requirements',
      'GET /health': 'Service health check',
      'GET /': 'Service information'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Matching Service running on http://localhost:${PORT}`);
  console.log(`Endpoint: POST http://localhost:${PORT}/match`);
  console.log(`Health: GET http://localhost:${PORT}/health`);
});