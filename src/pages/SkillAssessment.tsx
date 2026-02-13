import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, Button, Radio, RadioGroup, FormControlLabel, FormControl, LinearProgress, Chip, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { generateSkillAssessmentQuestions, GeneratedQuestion } from '../services/questionGenerator';

export const SkillAssessment = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const loadQuestions = async (category: 'technical' | 'aptitude') => {
    setLoading(true);
    try {
      const generatedQuestions = await generateSkillAssessmentQuestions(category);
      setQuestions(generatedQuestions);
      setAssessmentStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswerChange = (answer: number) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setAssessmentStarted(false);
    setQuestions([]);
  };

  const handleTabChange = (_, newValue: number) => {
    setActiveTab(newValue);
    if (assessmentStarted) {
      resetAssessment();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Brain size={32} color="#2196f3" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Skill Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test your technical and analytical abilities
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
          }}
        >
          <Tab icon={<Code size={20} />} iconPosition="start" label="Technical Skills" />
          <Tab icon={<Lightbulb size={20} />} iconPosition="start" label="Aptitude & Reasoning" />
        </Tabs>
      </Card>

      {!assessmentStarted && !showResults && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <Box sx={{ mb: 3 }}>
                {activeTab === 0 ? <Code size={64} /> : <Lightbulb size={64} />}
              </Box>
            </motion.div>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Ready for the Assessment?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {activeTab === 0
                ? 'Test your technical skills with 15 dynamically generated questions covering DSA, OOP, Databases, and more.'
                : 'Challenge yourself with 15 aptitude and reasoning questions including logical thinking and pattern recognition.'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              Duration: ~30-45 minutes | No time limit per question | Immediate scoring
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => loadQuestions(activeTab === 0 ? 'technical' : 'aptitude')}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                },
                py: 1.5,
                px: 4,
              }}
            >
              {loading ? 'Generating Questions...' : 'Start Assessment'}
            </Button>
          </CardContent>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {assessmentStarted && !showResults && questions.length > 0 && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Question {currentQuestion + 1} of {questions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progress)}% Complete
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  {questions[currentQuestion].question}
                </Typography>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[currentQuestion] ?? ''}
                    onChange={(e) => handleAnswerChange(Number(e.target.value))}
                  >
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <FormControlLabel
                          value={index}
                          control={<Radio />}
                          label={option}
                          sx={{
                            mb: 1,
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            width: '100%',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    sx={{ flex: 1 }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === undefined}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                      },
                    }}
                  >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #2196f320, #9c27b020)' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  {score >= questions.length * 0.7 ? (
                    <CheckCircle size={80} color="#4caf50" />
                  ) : (
                    <XCircle size={80} color="#f44336" />
                  )}
                </motion.div>

                <Typography variant="h3" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  {score} / {questions.length}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {((score / questions.length) * 100).toFixed(0)}% Score
                </Typography>

                <Chip
                  label={
                    score >= questions.length * 0.8
                      ? 'Outstanding Performance!'
                      : score >= questions.length * 0.7
                      ? 'Excellent Performance!'
                      : score >= questions.length * 0.5
                      ? 'Good Job!'
                      : 'Keep Practicing!'
                  }
                  color={
                    score >= questions.length * 0.7
                      ? 'success'
                      : score >= questions.length * 0.5
                      ? 'primary'
                      : 'error'
                  }
                  sx={{ mt: 2, px: 2, py: 1, fontSize: '1rem' }}
                />

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={resetAssessment}
                    sx={{
                      background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                      },
                    }}
                  >
                    Take Assessment Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
