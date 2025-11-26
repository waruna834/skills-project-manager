/**
 * Calculate match score between personnel skills and required skills
 */
const calculateMatchScore = (personnelSkills, requiredSkills) => {
  let totalScore = 0;
  let matchedSkills = 0;
  let skillDetails = [];
  let missingSkills = [];
  
  requiredSkills.forEach(reqSkill => {
    const personnelSkill = personnelSkills.find(
      ps => ps.skill_id === reqSkill.skill_id
    );
    
    if (personnelSkill) {
      // Personnel has this skill
      const proficiencyDiff = personnelSkill.proficiency_level - reqSkill.required_proficiency;
      
      let skillScore = 0;
      let status = '';
      
      if (proficiencyDiff >= 0) {
        // Meets or exceeds requirement
        skillScore = 100 + (proficiencyDiff * 20); // Bonus for exceeding
        status = proficiencyDiff > 0 ? 'Exceeds' : 'Meets';
        matchedSkills++;
      } else {
        // Has skill but below required level
        skillScore = 50 + (proficiencyDiff * 15); // Penalty for being below
        status = 'Below';
      }
      
      totalScore += skillScore;
      
      skillDetails.push({
        skill_name: reqSkill.skill_name,
        required: reqSkill.required_proficiency,
        actual: personnelSkill.proficiency_level,
        status: status,
        score: skillScore
      });
    } else {
      // Missing skill completely
      missingSkills.push({
        skill_name: reqSkill.skill_name,
        required_proficiency: reqSkill.required_proficiency
      });
      
      skillDetails.push({
        skill_name: reqSkill.skill_name,
        required: reqSkill.required_proficiency,
        actual: 0,
        status: 'Missing',
        score: 0
      });
    }
  });
  
  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills / requiredSkills.length) * 100)
    : 0;
    
  return {
    totalScore,
    matchedSkills,
    totalRequired: requiredSkills.length,
    matchPercentage,
    missingSkills,
    skillDetails
  };
};

/**
 * Check personnel availability for project dates
 */
const checkAvailability = (allocations, projectStart, projectEnd) => {
  if (!allocations || allocations.length === 0) {
    return { 
      available: true, 
      utilizationPercentage: 0,
      conflictingProjects: []
    };
  }
  
  let totalOverlap = 0;
  const conflictingProjects = [];
  
  const projectStartDate = new Date(projectStart);
  const projectEndDate = new Date(projectEnd);
  const projectDuration = Math.ceil(
    (projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24)
  );
  
  allocations.forEach(alloc => {
    const allocStart = new Date(alloc.allocation_start);
    const allocEnd = new Date(alloc.allocation_end);
    
    // Check if there's an overlap
    const overlapStart = allocStart > projectStartDate ? allocStart : projectStartDate;
    const overlapEnd = allocEnd < projectEndDate ? allocEnd : projectEndDate;
    
    if (overlapStart < overlapEnd) {
      const overlapDays = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24));
      const overlapPercentage = overlapDays * (alloc.allocation_percentage / 100);
      totalOverlap += overlapPercentage;
      
      conflictingProjects.push({
        project_name: alloc.project_name || 'Unknown Project',
        start: alloc.allocation_start,
        end: alloc.allocation_end,
        allocation: alloc.allocation_percentage
      });
    }
  });
  
  const utilizationPercentage = projectDuration > 0
    ? Math.round((totalOverlap / projectDuration) * 100)
    : 0;
  
  return {
    available: utilizationPercentage < 100,
    utilizationPercentage,
    conflictingProjects
  };
};

/**
 * Calculate experience level bonus
 */
const getExperienceBonus = (experienceLevel) => {
  const bonuses = {
    'Senior': 30,
    'Mid': 15,
    'Junior': 0
  };
  return bonuses[experienceLevel] || 0;
};

module.exports = {
  calculateMatchScore,
  checkAvailability,
  getExperienceBonus
};