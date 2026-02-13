import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';
import { getDashboardStats, getSkillData, getProgressData, getAssessmentData, DashboardStats, SkillData, ProgressData, AssessmentData } from '../services/dashboardService';

const COLORS = ['#2196f3', '#9c27b0', '#e91e63', '#ff9800'];

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        border: `1px solid ${color}20`,
        boxShadow: `0 4px 20px ${color}15`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 8px 30px ${color}25`,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {value}
            </Typography>
          </Box>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${color}20`,
              }}
            >
              <Icon size={32} color={color} />
            </Box>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, skills, progress, assessments] = await Promise.all([
          getDashboardStats(),
          getSkillData(),
          getProgressData(),
          getAssessmentData(),
        ]);
        setStats(statsData);
        setSkillData(skills);
        setProgressData(progress);
        setAssessmentData(assessments);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={400} height={20} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={150} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, background: 'linear-gradient(135deg, #2196f3, #9c27b0)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dashboard Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 3, background: 'linear-gradient(90deg, #2196f3, #9c27b0)', borderRadius: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Track your progress and skill development
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Overall Score" value={`${stats.overallScore}%`} icon={TrendingUp} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Assessments Completed" value={stats.assessmentsCompleted} icon={Award} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Skills Mastered" value={stats.skillsMastered} icon={Target} color="#e91e63" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Resources Accessed" value={stats.resourcesAccessed} icon={BookOpen} color="#ff9800" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                border: '1px solid #e0e7ff',
                boxShadow: '0 10px 40px rgba(33, 150, 243, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#1976d2' }}>
                    Skill Distribution
                  </Typography>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'linear-gradient(135deg, #2196f3, #9c27b0)' }} />
                </Box>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <Pie
                      data={skillData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={85}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                border: '1px solid #e0e7ff',
                boxShadow: '0 10px 40px rgba(156, 39, 176, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#7b1fa2' }}>
                    Assessment Scores
                  </Typography>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'linear-gradient(135deg, #9c27b0, #e91e63)' }} />
                </Box>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={assessmentData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="subject"
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                      cursor={{ fill: 'rgba(33, 150, 243, 0.1)' }}
                    />
                    <Bar
                      dataKey="score"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2196f3" />
                        <stop offset="100%" stopColor="#1976d2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                border: '1px solid #e0e7ff',
                boxShadow: '0 10px 40px rgba(233, 30, 99, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#c2185b' }}>
                    Progress Over Time
                  </Typography>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'linear-gradient(135deg, #e91e63, #ff9800)' }} />
                </Box>
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart
                    data={progressData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9c27b0" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#9c27b0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                      cursor={{ stroke: 'rgba(156, 39, 176, 0.2)', strokeWidth: 2 }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#9c27b0"
                      strokeWidth={4}
                      dot={{ fill: '#9c27b0', r: 6, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                      animationDuration={800}
                      animationEasing="ease-out"
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};
