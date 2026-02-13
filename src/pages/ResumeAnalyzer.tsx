import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel, TextField, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const jobRoles = [
  'Software Engineer',
  'Associate Software Engineer',
  'Data Analyst',
  'Web Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Machine Learning Engineer',
];

export const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [useCustomDescription, setUseCustomDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setAnalysis(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      if (useCustomDescription) {
        formData.append('job_description', customJobDescription);
      } else {
        formData.append('job_role', jobRole);
      }

      const response = await fetch(API_ENDPOINTS.resumeAnalyze, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.detail || errBody?.error || `Resume analyze failed (${response.status})`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error: any) {
      console.error('Error analyzing resume:', error);
      setError(error.message || 'Failed to analyze resume. Please ensure the backend server is running.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FileText size={32} color="#2196f3" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Resume Analyzer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get AI-powered insights to improve your resume
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Upload Your Resume
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload size={20} />}
              fullWidth
              sx={{
                py: 3,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                },
              }}
            >
              {selectedFile ? selectedFile.name : 'Click to Upload PDF Resume'}
              <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Analysis Type</InputLabel>
              <Select
                value={useCustomDescription ? 'custom' : 'preset'}
                onChange={(e) => setUseCustomDescription(e.target.value === 'custom')}
                label="Analysis Type"
              >
                <MenuItem value="preset">Select Job Role</MenuItem>
                <MenuItem value="custom">Custom Job Description</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {!useCustomDescription ? (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Job Role</InputLabel>
              <Select value={jobRole} onChange={(e) => setJobRole(e.target.value)} label="Job Role">
                {jobRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Custom Job Description"
              value={customJobDescription}
              onChange={(e) => setCustomJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              sx={{ mb: 3 }}
            />
          )}

          <Button
            variant="contained"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Sparkles size={20} />}
            disabled={!selectedFile || loading || (!useCustomDescription && !jobRole) || (useCustomDescription && !customJobDescription)}
            onClick={handleAnalyze}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
              },
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                      {analysis.score}%
                    </Typography>
                  </motion.div>
                  <Typography variant="h6" color="text.secondary">
                    Resume Match Score
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircle size={24} color="#4caf50" />
                    <Typography variant="h6" fontWeight="bold">
                      Strengths
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    {analysis.strengths.map((strength: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Typography variant="body1" sx={{ mb: 1, display: 'flex', gap: 1 }}>
                          <span>•</span>
                          <span>{strength}</span>
                        </Typography>
                      </motion.div>
                    ))}
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AlertCircle size={24} color="#ff9800" />
                    <Typography variant="h6" fontWeight="bold">
                      Areas for Improvement
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Typography variant="body1" sx={{ mb: 1, display: 'flex', gap: 1 }}>
                          <span>•</span>
                          <span>{improvement}</span>
                        </Typography>
                      </motion.div>
                    ))}
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Detected Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.keywords.map((keyword: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Chip
                          label={keyword}
                          color="primary"
                          variant="outlined"
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>

                <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Overall Feedback
                  </Typography>
                  <Typography variant="body1">{analysis.feedback}</Typography>
                </Paper>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
