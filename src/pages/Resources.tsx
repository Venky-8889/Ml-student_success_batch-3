import { Box, Card, CardContent, Typography, Button, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Code, Database, Globe, Brain, Cpu, LineChart } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  topics: string[];
  links: { name: string; url: string }[];
}

const resources: Resource[] = [
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Master Java fundamentals, OOP concepts, and advanced features',
    icon: Code,
    color: '#f44336',
    topics: ['Core Java', 'Collections', 'Multithreading', 'Spring Boot'],
    links: [
      { name: 'YouTube Tutorial', url: 'https://www.youtube.com/results?search_query=java+programming+tutorial' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/java/' },
      { name: 'Practice Problems', url: 'https://leetcode.com/problemset/all/?topicSlugs=java' },
    ],
  },
  {
    id: 'python',
    title: 'Python Development',
    description: 'Learn Python from basics to advanced libraries and frameworks',
    icon: Brain,
    color: '#4caf50',
    topics: ['Syntax', 'Data Structures', 'Django', 'Machine Learning'],
    links: [
      { name: 'YouTube Tutorial', url: 'https://www.youtube.com/results?search_query=python+programming+tutorial' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/python-programming-language/' },
      { name: 'Real Python', url: 'https://realpython.com/' },
    ],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Essential DSA concepts for coding interviews and problem solving',
    icon: Cpu,
    color: '#2196f3',
    topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    links: [
      { name: 'Striver Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' },
      { name: 'LeetCode', url: 'https://leetcode.com/problemset/all/' },
      { name: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/' },
    ],
  },
  {
    id: 'webdev',
    title: 'Web Development',
    description: 'Full-stack web development with modern frameworks and tools',
    icon: Globe,
    color: '#ff9800',
    topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
    links: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/' },
      { name: 'YouTube Tutorial', url: 'https://www.youtube.com/results?search_query=web+development+tutorial' },
      { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
    ],
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'Learn SQL, NoSQL, and database design principles',
    icon: Database,
    color: '#9c27b0',
    topics: ['SQL', 'MongoDB', 'PostgreSQL', 'Database Design'],
    links: [
      { name: 'SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
      { name: 'GeeksforGeeks DBMS', url: 'https://www.geeksforgeeks.org/dbms/' },
      { name: 'MongoDB University', url: 'https://learn.mongodb.com/' },
    ],
  },
  {
    id: 'datascience',
    title: 'Data Science',
    description: 'Analytics, machine learning, and data visualization',
    icon: LineChart,
    color: '#00bcd4',
    topics: ['Statistics', 'ML Algorithms', 'Pandas', 'Visualization'],
    links: [
      { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
      { name: 'YouTube Tutorial', url: 'https://www.youtube.com/results?search_query=data+science+tutorial' },
      { name: 'Towards Data Science', url: 'https://towardsdatascience.com/' },
    ],
  },
];

export const Resources = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <BookOpen size={32} color="#2196f3" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Learning Resources
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Curated resources to boost your skills
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Grid item xs={12} md={6} key={resource.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `${resource.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={28} color={resource.color} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {resource.title}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {resource.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {resource.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{
                            bgcolor: `${resource.color}15`,
                            color: resource.color,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {resource.links.map((link) => (
                        <Button
                          key={link.name}
                          variant="outlined"
                          endIcon={<ExternalLink size={16} />}
                          onClick={() => window.open(link.url, '_blank')}
                          sx={{
                            justifyContent: 'space-between',
                            borderColor: `${resource.color}50`,
                            color: resource.color,
                            '&:hover': {
                              borderColor: resource.color,
                              bgcolor: `${resource.color}10`,
                            },
                          }}
                        >
                          {link.name}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
