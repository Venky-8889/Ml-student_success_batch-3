import { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper, Chip, LinearProgress, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Play, Clock, CheckCircle } from 'lucide-react';
import { generateInterviewQuestions } from '../services/questionGenerator';

const jobRoles = [
  'Software Engineer',
  'Associate Software Engineer',
  'Data Analyst',
  'Web Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
];

export const MockInterview = () => {
  const [jobRole, setJobRole] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, timeRemaining]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const generatedQuestions = await generateInterviewQuestions(jobRole);
      setQuestions(generatedQuestions);
      setInterviewStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
      setCurrentAnswer('');
      setInterviewComplete(false);
      setTimeRemaining(120);
      await startCamera();
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(120);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    setInterviewComplete(true);
    setInterviewStarted(false);
    stopCamera();
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewComplete(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setTimeRemaining(120);
    stopCamera();
    setJobRole('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Video size={32} color="#2196f3" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Mock Interview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Practice with AI-generated interview questions
          </Typography>
        </Box>
      </Box>

      {!interviewStarted && !interviewComplete && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Setup Interview
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Job Role</InputLabel>
              <Select value={jobRole} onChange={(e) => setJobRole(e.target.value)} label="Select Job Role">
                {jobRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Interview Format:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 5 AI-generated questions tailored to your selected role
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 2 minutes per question
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Camera will be activated for realistic practice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Receive performance feedback at the end
              </Typography>
            </Paper>

            <Button
              variant="contained"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Play size={20} />}
              disabled={!jobRole || loading}
              onClick={startInterview}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                },
              }}
            >
              {loading ? 'Generating Questions...' : 'Start Interview'}
            </Button>
          </CardContent>
        </Card>
      )}

      {interviewStarted && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip label={`Question ${currentQuestion + 1} of ${questions.length}`} color="primary" />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={20} color={timeRemaining < 30 ? '#f44336' : '#4caf50'} />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={timeRemaining < 30 ? 'error' : 'success.main'}
                    >
                      {formatTime(timeRemaining)}
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={((currentQuestion + 1) / questions.length) * 100}
                  sx={{ mb: 3, height: 8, borderRadius: 4 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {questions[currentQuestion]}
                      </Typography>
                    </Paper>

                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      label="Your Answer"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here or speak to the camera..."
                      sx={{ mb: 2 }}
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                        },
                      }}
                    >
                      {currentQuestion === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                    </Button>
                  </Box>

                  <Box>
                    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, bgcolor: 'black', position: 'relative' }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'cover',
                        }}
                      />
                      {cameraActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#f44336',
                              animation: 'pulse 2s infinite',
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                            REC
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {interviewComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))'
                  : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(156, 39, 176, 0.05))',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <CheckCircle size={80} color="#4caf50" />
              </motion.div>

              <Typography variant="h4" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                Interview Complete!
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Great job completing the mock interview
              </Typography>

              <Chip
                label={`${answers.length} questions answered`}
                color="primary"
                sx={{ mt: 2, px: 2, py: 1, fontSize: '1rem' }}
              />

              <Paper elevation={0} sx={{ p: 3, mt: 4, bgcolor: 'background.default', textAlign: 'left' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Performance Summary
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Completed {answers.length} out of {questions.length} questions
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Average response time: 1:45 minutes
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Interview Role: {jobRole}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Keep practicing to improve your interview skills!
                </Typography>
              </Paper>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="outlined" fullWidth onClick={resetInterview}>
                  Take Another Interview
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                    },
                  }}
                  onClick={() => (window.location.href = '/')}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};
