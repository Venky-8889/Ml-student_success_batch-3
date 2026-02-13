export interface DashboardStats {
  overallScore: number;
  assessmentsCompleted: number;
  skillsMastered: number;
  resourcesAccessed: number;
}

export interface SkillData {
  name: string;
  value: number;
}

export interface ProgressData {
  month: string;
  score: number;
}

export interface AssessmentData {
  subject: string;
  score: number;
}

const getDefaultStats = (): DashboardStats => ({
  overallScore: 0,
  assessmentsCompleted: 0,
  skillsMastered: 0,
  resourcesAccessed: 0,
});

const getDefaultSkillData = (): SkillData[] => [
  { name: 'Technical', value: 0 },
  { name: 'Communication', value: 0 },
  { name: 'Problem Solving', value: 0 },
  { name: 'Leadership', value: 0 },
];

const getDefaultProgressData = (): ProgressData[] => [
  { month: 'Jan', score: 0 },
  { month: 'Feb', score: 0 },
  { month: 'Mar', score: 0 },
  { month: 'Apr', score: 0 },
  { month: 'May', score: 0 },
  { month: 'Jun', score: 0 },
];

const getDefaultAssessmentData = (): AssessmentData[] => [
  { subject: 'Java', score: 0 },
  { subject: 'Python', score: 0 },
  { subject: 'DSA', score: 0 },
  { subject: 'Web Dev', score: 0 },
  { subject: 'Database', score: 0 },
];

const generateMockStats = (): DashboardStats => {
  const sessionCount = Math.floor(Math.random() * 30) + 5;
  const skillCount = Math.floor(Math.random() * 15) + 3;
  const resourceCount = Math.floor(Math.random() * 50) + 10;
  const avgScore = Math.floor(Math.random() * 40) + 50;

  return {
    overallScore: avgScore,
    assessmentsCompleted: sessionCount,
    skillsMastered: skillCount,
    resourcesAccessed: resourceCount,
  };
};

const generateMockSkillData = (): SkillData[] => [
  { name: 'Technical', value: Math.floor(Math.random() * 50) + 30 },
  { name: 'Communication', value: Math.floor(Math.random() * 50) + 40 },
  { name: 'Problem Solving', value: Math.floor(Math.random() * 50) + 35 },
  { name: 'Leadership', value: Math.floor(Math.random() * 50) + 25 },
];

const generateMockProgressData = (): ProgressData[] => {
  let currentScore = 40;
  return [
    { month: 'Jan', score: currentScore },
    { month: 'Feb', score: (currentScore += Math.floor(Math.random() * 15)) },
    { month: 'Mar', score: (currentScore += Math.floor(Math.random() * 15)) },
    { month: 'Apr', score: (currentScore += Math.floor(Math.random() * 15)) },
    { month: 'May', score: (currentScore += Math.floor(Math.random() * 15)) },
    { month: 'Jun', score: (currentScore += Math.floor(Math.random() * 15)) },
  ];
};

const generateMockAssessmentData = (): AssessmentData[] => [
  { subject: 'Java', score: Math.floor(Math.random() * 50) + 50 },
  { subject: 'Python', score: Math.floor(Math.random() * 50) + 40 },
  { subject: 'DSA', score: Math.floor(Math.random() * 50) + 35 },
  { subject: 'Web Dev', score: Math.floor(Math.random() * 50) + 55 },
  { subject: 'Database', score: Math.floor(Math.random() * 50) + 42 },
];

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const stored = localStorage.getItem('dashboardStats');
    if (stored) {
      const data = JSON.parse(stored);
      const timestamp = data.timestamp || 0;
      const now = Date.now();
      if (now - timestamp < 60000) {
        return data.stats;
      }
    }

    const stats = generateMockStats();
    localStorage.setItem('dashboardStats', JSON.stringify({ stats, timestamp: Date.now() }));
    return stats;
  } catch (error) {
    console.warn('Error getting dashboard stats:', error);
    return getDefaultStats();
  }
};

export const getSkillData = async (): Promise<SkillData[]> => {
  try {
    const stored = localStorage.getItem('skillData');
    if (stored) {
      const data = JSON.parse(stored);
      const timestamp = data.timestamp || 0;
      const now = Date.now();
      if (now - timestamp < 60000) {
        return data.skills;
      }
    }

    const skills = generateMockSkillData();
    localStorage.setItem('skillData', JSON.stringify({ skills, timestamp: Date.now() }));
    return skills;
  } catch (error) {
    console.warn('Error getting skill data:', error);
    return getDefaultSkillData();
  }
};

export const getProgressData = async (): Promise<ProgressData[]> => {
  try {
    const stored = localStorage.getItem('progressData');
    if (stored) {
      const data = JSON.parse(stored);
      const timestamp = data.timestamp || 0;
      const now = Date.now();
      if (now - timestamp < 60000) {
        return data.progress;
      }
    }

    const progress = generateMockProgressData();
    localStorage.setItem('progressData', JSON.stringify({ progress, timestamp: Date.now() }));
    return progress;
  } catch (error) {
    console.warn('Error getting progress data:', error);
    return getDefaultProgressData();
  }
};

export const getAssessmentData = async (): Promise<AssessmentData[]> => {
  try {
    const stored = localStorage.getItem('assessmentData');
    if (stored) {
      const data = JSON.parse(stored);
      const timestamp = data.timestamp || 0;
      const now = Date.now();
      if (now - timestamp < 60000) {
        return data.assessments;
      }
    }

    const assessments = generateMockAssessmentData();
    localStorage.setItem('assessmentData', JSON.stringify({ assessments, timestamp: Date.now() }));
    return assessments;
  } catch (error) {
    console.warn('Error getting assessment data:', error);
    return getDefaultAssessmentData();
  }
};

export const updateAssessmentScore = (subject: string, score: number): void => {
  try {
    const stored = localStorage.getItem('assessmentData');
    let assessments = getDefaultAssessmentData();

    if (stored) {
      const data = JSON.parse(stored);
      assessments = data.assessments;
    }

    const index = assessments.findIndex((a) => a.subject === subject);
    if (index !== -1) {
      const current = assessments[index].score;
      assessments[index].score = Math.round((current + score) / 2);
    }

    localStorage.setItem('assessmentData', JSON.stringify({ assessments, timestamp: Date.now() }));
  } catch (error) {
    console.warn('Error updating assessment score:', error);
  }
};
