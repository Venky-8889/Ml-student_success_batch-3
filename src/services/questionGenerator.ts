import { GEMINI_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL, USE_GEMINI } from '../config/api';

export interface GeneratedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const generateQuestionsPrompt = (category: 'technical' | 'aptitude', count: number = 15): string => {
  if (category === 'technical') {
    return `Generate exactly ${count} multiple choice questions for technical interview preparation.
    Include topics like:
    - Data Structures and Algorithms
    - Object Oriented Programming
    - Database Concepts
    - Web Development
    - System Design basics

    IMPORTANT: Each question must have exactly 4 distinct answer options with actual meaningful answers. Do NOT use placeholder text like "Option 1", "Option 2", "Option A", "Option B", etc.

    Format each question as JSON object with this structure:
    {
      "id": number,
      "question": "question text",
      "options": ["first actual answer", "second actual answer", "third actual answer", "fourth actual answer"],
      "correctAnswer": 0 (index of correct option, 0-3)
    }

    Example of GOOD options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"]
    Example of BAD options (DO NOT USE): ["Option 1", "Option 2", "Option 3", "Option 4"]

    Return only a JSON array of questions without any additional text or markdown.`;
  } else {
    return `Generate exactly ${count} multiple choice questions for aptitude and logical reasoning.
    Include topics like:
    - Number Series
    - Pattern Recognition
    - Logical Reasoning
    - Verbal Reasoning
    - Analytical Thinking
    - Puzzle Solving

    IMPORTANT: Each question must have exactly 4 distinct answer options with actual meaningful answers. Do NOT use placeholder text like "Option 1", "Option 2", "Option A", "Option B", etc.

    Format each question as JSON object with this structure:
    {
      "id": number,
      "question": "question text",
      "options": ["first actual answer", "second actual answer", "third actual answer", "fourth actual answer"],
      "correctAnswer": 0 (index of correct option, 0-3)
    }

    Example of GOOD options: ["40", "42", "44", "46"]
    Example of BAD options (DO NOT USE): ["Option 1", "Option 2", "Option 3", "Option 4"]

    Return only a JSON array of questions without any additional text or markdown.`;
  }
};

const generateInterviewQuestionsPrompt = (jobRole: string): string => {
  return `Generate exactly 5 realistic interview questions for a ${jobRole} position.
  Make questions specific to this role and realistic for actual interviews.

  Format as a JSON array where each question is a simple string:
  ["question1", "question2", "question3", "question4", "question5"]

  Return only the JSON array without any additional text.`;
};

const isOllamaConfigured = (): boolean => Boolean(OLLAMA_BASE_URL);

const callOllama = async (prompt: string): Promise<unknown> => {
  if (!isOllamaConfigured()) {
    throw new Error('Ollama not configured');
  }

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL || 'llama3.1',
      prompt,
      // Ask Ollama to enforce JSON-formatted output to reduce parsing errors.
      format: 'json',
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.response;

  if (content === undefined || content === null) {
    throw new Error('No content from Ollama');
  }

  return content;
};

const extractJsonArray = (raw: string): string | null => {
  // Try non-greedy match to capture the first JSON array in the string.
  const firstArray = raw.match(/\[[\s\S]*?\]/);
  if (firstArray?.[0]) return firstArray[0];
  // Fallback: if the whole string already looks like an array.
  if (raw.trim().startsWith('[') && raw.trim().endsWith(']')) {
    return raw.trim();
  }
  return null;
};

const normalizeGeneratedQuestions = (items: unknown): GeneratedQuestion[] | null => {
  if (!Array.isArray(items)) {
    console.warn('normalizeGeneratedQuestions: items is not an array', typeof items);
    return null;
  }

  const normalized: GeneratedQuestion[] = [];

  items.forEach((item, index) => {
    // Skip simple string questions - they don't have proper structure
    if (typeof item === 'string') {
      console.warn(`Question ${index + 1} is a plain string, skipping`);
      return;
    }

    if (typeof item !== 'object' || item === null) {
      console.warn(`Question ${index + 1} is not a valid object, skipping`);
      return;
    }

    const q = item as Partial<GeneratedQuestion> & {
      options?: unknown;
      correctAnswer?: unknown;
    };

    if (typeof q.question !== 'string' || !q.question.trim()) {
      console.warn(`Question ${index + 1} has invalid question text, skipping`);
      return;
    }

    // Extract and validate options - be more lenient
    let optionsArray: string[] = [];
    
    if (Array.isArray(q.options) && q.options.length >= 2) {
      // Convert all options to strings and trim
      optionsArray = q.options.map(opt => String(opt).trim()).filter(opt => opt.length > 0);
      
      // If we have valid options, use them (even if some are placeholders)
      if (optionsArray.length >= 2) {
        // Ensure we have exactly 4 options
        while (optionsArray.length < 4) {
          optionsArray.push(`Option ${optionsArray.length + 1}`);
        }
        if (optionsArray.length > 4) {
          optionsArray = optionsArray.slice(0, 4);
        }
      } else {
        // Fallback if options are invalid
        optionsArray = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      }
    } else {
      // If no valid options array, create default ones
      optionsArray = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      console.warn(`Question ${index + 1} has invalid options, using defaults`);
    }

    // Validate correctAnswer
    let correctAnswer =
      typeof q.correctAnswer === 'number' && Number.isFinite(q.correctAnswer) ? q.correctAnswer : 0;

    if (correctAnswer < 0 || correctAnswer >= optionsArray.length) {
      correctAnswer = 0;
    }

    normalized.push({
      id: index + 1,
      question: q.question.trim(),
      options: optionsArray,
      correctAnswer,
    });
  });

  return normalized.length > 0 ? normalized : null;
};

export const generateSkillAssessmentQuestions = async (
  category: 'technical' | 'aptitude'
): Promise<GeneratedQuestion[]> => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/835e8465-58d6-4b7f-9053-846e222ad9e9', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'pre-fix-2',
      hypothesisId: 'H1',
      location: 'questionGenerator.ts:generateSkillAssessmentQuestions',
      message: 'entry',
      data: { category },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  try {
    if (isOllamaConfigured()) {
      try {
        const ollamaContent = await callOllama(generateQuestionsPrompt(category, 15));
        
        // Debug: Log what Ollama actually returned
        console.log('Ollama raw response type:', typeof ollamaContent);
        console.log('Ollama raw response isArray:', Array.isArray(ollamaContent));
        if (typeof ollamaContent === 'string') {
          console.log('Ollama raw response (first 500 chars):', ollamaContent.substring(0, 500));
        } else {
          console.log('Ollama raw response:', ollamaContent);
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/835e8465-58d6-4b7f-9053-846e222ad9e9', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'pre-fix-2',
            hypothesisId: 'H2',
            location: 'questionGenerator.ts:ollamaResponse',
            message: 'ollama response meta',
            data: {
              isArray: Array.isArray(ollamaContent),
              type: typeof ollamaContent,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        let parsed: unknown = null;

        if (Array.isArray(ollamaContent)) {
          parsed = ollamaContent;
        } else if (typeof ollamaContent === 'string') {
          try {
            const parsedContent = JSON.parse(ollamaContent);
            // If parsing succeeds, check if it's an array or wrapped in an object
            if (Array.isArray(parsedContent)) {
              // Validate it's an array of question objects, not just strings
              if (parsedContent.length > 0 && typeof parsedContent[0] === 'object' && parsedContent[0] !== null) {
                const firstItem = parsedContent[0] as Record<string, unknown>;
                if (typeof firstItem.question === 'string' || typeof firstItem.id === 'number') {
                  parsed = parsedContent;
                } else {
                  console.warn('Parsed array does not contain question objects');
                }
              } else {
                parsed = parsedContent;
              }
            } else if (typeof parsedContent === 'object' && parsedContent !== null) {
              // Check for common wrapper keys
              const wrapped = parsedContent as Record<string, unknown>;
              if (Array.isArray(wrapped.questions)) {
                parsed = wrapped.questions;
              } else if (Array.isArray(wrapped.data)) {
                parsed = wrapped.data;
              } else {
                // Check if it's an object with numbered keys (like {"1": {...}, "2": {...}})
                // Convert object values to array
                const values = Object.values(wrapped);
                if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
                  // Check if first value looks like a question object
                  const firstValue = values[0] as Record<string, unknown>;
                  if (typeof firstValue.question === 'string' || typeof firstValue.id === 'number') {
                    parsed = values;
                    console.log('Converted object with numbered keys to array, length:', values.length);
                  } else {
                    console.warn('Object values do not look like question objects');
                  }
                } else {
                  console.warn('Object does not contain question objects as values');
                }
              }
            }
          } catch (parseError) {
            console.warn('JSON.parse failed, trying alternative parsing:', parseError);
            // Try to extract the full JSON object first (not just arrays)
            // Look for the outermost object structure
            try {
              // Try to find the complete JSON object structure
              const objectMatch = ollamaContent.match(/\{[\s\S]*\}/);
              if (objectMatch) {
                const fullObject = JSON.parse(objectMatch[0]);
                if (typeof fullObject === 'object' && fullObject !== null) {
                  const wrapped = fullObject as Record<string, unknown>;
                  const values = Object.values(wrapped);
                  if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
                    const firstValue = values[0] as Record<string, unknown>;
                    if (typeof firstValue.question === 'string' || typeof firstValue.id === 'number') {
                      parsed = values;
                      console.log('Extracted object with numbered keys from string, length:', values.length);
                    }
                  }
                }
              }
            } catch (altError) {
              console.warn('Alternative parsing also failed:', altError);
            }
          }
        } else if (typeof ollamaContent === 'object' && ollamaContent !== null) {
          // Sometimes models wrap data, e.g. { questions: [...] }
          const wrapped = ollamaContent as Record<string, unknown>;
          if (Array.isArray(wrapped.questions)) {
            parsed = wrapped.questions;
          } else if (Array.isArray(wrapped.data)) {
            parsed = wrapped.data;
          } else {
            // Check if it's an object with numbered keys - convert to array
            const values = Object.values(wrapped);
            if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
              const firstValue = values[0] as Record<string, unknown>;
              if (typeof firstValue.question === 'string' || typeof firstValue.id === 'number') {
                parsed = values;
                console.log('Converted object with numbered keys to array, length:', values.length);
              } else {
                // Check if it's already an array-like object or find any array property
                const arrayKey = Object.keys(wrapped).find(key => Array.isArray(wrapped[key]));
                if (arrayKey) {
                  parsed = wrapped[arrayKey];
                }
              }
            } else {
              // Check if it's already an array-like object or find any array property
              const arrayKey = Object.keys(wrapped).find(key => Array.isArray(wrapped[key]));
              if (arrayKey) {
                parsed = wrapped[arrayKey];
              }
            }
          }
        }

        console.log('After parsing, parsed value:', parsed);
        console.log('After parsing, isArray:', Array.isArray(parsed));
        if (Array.isArray(parsed)) {
          console.log('After parsing, array length:', parsed.length);
          if (parsed.length > 0) {
            console.log('After parsing, first item:', parsed[0]);
            console.log('After parsing, first item type:', typeof parsed[0]);
            // Validate that it's an array of question objects, not strings or options
            if (typeof parsed[0] === 'string') {
              console.warn('Parsed array contains strings (likely options array), rejecting');
              parsed = null;
            } else if (typeof parsed[0] === 'object' && parsed[0] !== null) {
              const firstItem = parsed[0] as Record<string, unknown>;
              if (!firstItem.question && !firstItem.id) {
                console.warn('Parsed array items do not have question or id property, rejecting');
                parsed = null;
              }
            }
          }
        }
        
        if (parsed) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/835e8465-58d6-4b7f-9053-846e222ad9e9', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: 'debug-session',
              runId: 'pre-fix-2',
              hypothesisId: 'H3',
              location: 'questionGenerator.ts:ollamaParsed',
              message: 'parsed shape',
              data: {
                isArray: Array.isArray(parsed),
                length: Array.isArray(parsed) ? parsed.length : null,
                firstType: Array.isArray(parsed) && parsed.length > 0 ? typeof parsed[0] : null,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
          
          // Final validation: ensure parsed contains question objects
          if (Array.isArray(parsed)) {
            if (parsed.length === 0) {
              console.warn('Parsed array is empty');
              parsed = null;
            } else if (typeof parsed[0] === 'string') {
              console.warn('Parsed array contains strings, not question objects. Rejecting.');
              parsed = null;
            } else if (typeof parsed[0] === 'object' && parsed[0] !== null) {
              const firstItem = parsed[0] as Record<string, unknown>;
              if (!firstItem.question && !firstItem.id) {
                console.warn('Parsed array items do not have question or id property. Rejecting.');
                parsed = null;
              } else {
                console.log('Parsed array validated successfully. First question:', JSON.stringify(parsed[0], null, 2));
              }
            }
          }
          
          if (parsed) {
            const normalized = normalizeGeneratedQuestions(parsed);
            console.log('After normalization, result:', normalized);
            console.log('After normalization, length:', normalized?.length);
            
            if (normalized && normalized.length > 0) {
              console.log(`Successfully normalized ${normalized.length} questions from Ollama - RETURNING`);
              return normalized;
            }
            console.warn('Ollama returned unusable question format after normalization, falling back');
          }
        } else {
          console.warn('Parsed value is null/undefined');
        }
        console.warn('Ollama response missing usable JSON, falling back to Gemini/mock');
      } catch (ollamaError) {
        console.warn('Ollama generation failed, falling back to Gemini/mock', ollamaError);
      }
    }

    const canUseGemini = USE_GEMINI && GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
    if (!canUseGemini) {
      console.warn('Gemini disabled or not configured, returning mock questions');
      return getMockQuestions(category);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: generateQuestionsPrompt(category, 15),
                  },
                ],
              },
            ],
            safetySettings: [
              {
                category: 'HARM_CATEGORY_UNSPECIFIED',
                threshold: 'BLOCK_NONE',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content in response');
      }

      const jsonMatch = extractJsonArray(content);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from response');
      }

      const parsed = JSON.parse(jsonMatch);
      const normalized = normalizeGeneratedQuestions(parsed);
      if (normalized) {
        return normalized;
      }
      throw new Error('Gemini returned invalid question format after normalization attempt');
    } catch (geminiError) {
      console.warn('Gemini generation failed, returning mock questions', geminiError);
      return getMockQuestions(category);
    }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/835e8465-58d6-4b7f-9053-846e222ad9e9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix-2',
        hypothesisId: 'H4',
        location: 'questionGenerator.ts:catch',
        message: 'error generating questions',
        data: { error: error instanceof Error ? error.message : String(error) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    console.error('Error generating questions:', error);
    return getMockQuestions(category);
  }
};

export const generateInterviewQuestions = async (jobRole: string): Promise<string[]> => {
  try {
    if (isOllamaConfigured()) {
      try {
        const ollamaContent = await callOllama(generateInterviewQuestionsPrompt(jobRole));

        if (Array.isArray(ollamaContent)) {
          return ollamaContent.map((q) => String(q));
        }

        if (typeof ollamaContent === 'string') {
          try {
            const parsed = JSON.parse(ollamaContent);
            if (Array.isArray(parsed)) {
              return parsed.map((q) => String(q));
            }
          } catch {
            const json = extractJsonArray(ollamaContent);
            if (json) {
              try {
                const parsed = JSON.parse(json);
                if (Array.isArray(parsed)) {
                  return parsed.map((q) => String(q));
                }
              } catch {
                console.warn('Ollama interview JSON parse failed after extraction');
              }
            }
          }
        }

        if (typeof ollamaContent === 'object' && ollamaContent !== null) {
          const maybeQuestions = (ollamaContent as Record<string, unknown>).questions;
          if (Array.isArray(maybeQuestions)) {
            return maybeQuestions.map((q) => String(q));
          }
        }

        console.warn('Ollama interview response missing usable JSON, falling back to Gemini/mock');
      } catch (ollamaError) {
        console.warn('Ollama interview generation failed, falling back to Gemini/mock', ollamaError);
      }
    }

    const canUseGemini = USE_GEMINI && GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
    if (!canUseGemini) {
      console.warn('Gemini disabled or not configured, returning mock questions');
      return getMockInterviewQuestions(jobRole);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: generateInterviewQuestionsPrompt(jobRole),
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content in response');
      }

      const jsonMatch = extractJsonArray(content);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from response');
      }

      const questions: string[] = JSON.parse(jsonMatch);
      return questions;
    } catch (geminiError) {
      console.warn('Gemini interview generation failed, returning mock questions', geminiError);
      return getMockInterviewQuestions(jobRole);
    }
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return getMockInterviewQuestions(jobRole);
  }
};

const getMockQuestions = (category: 'technical' | 'aptitude'): GeneratedQuestion[] => {
  if (category === 'technical') {
    return [
      {
        id: 1,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: 'Which data structure is used for implementing DFS?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What does OOP stand for?',
        options: ['Object Oriented Programming', 'Open Operation Protocol', 'Optimal Order Processing', 'None'],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: 'In SQL, what does JOIN do?',
        options: ['Merges tables', 'Combines columns', 'Sorts data', 'Creates new database'],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: 'What is the primary key in a database?',
        options: ['A key used for encryption', 'A unique identifier for a record', 'A key for sorting', 'None'],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: 'Which of these is not a programming paradigm?',
        options: ['Functional', 'Procedural', 'Object-Oriented', 'Circular'],
        correctAnswer: 3,
      },
      {
        id: 9,
        question: 'What is polymorphism?',
        options: ['Many forms', 'Single form', 'Multiple types', 'Type conversion'],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: 'What is the purpose of an index in a database?',
        options: ['To encrypt data', 'To speed up queries', 'To validate data', 'To compress data'],
        correctAnswer: 1,
      },
      {
        id: 11,
        question: 'Which sorting algorithm has best average case complexity?',
        options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
        correctAnswer: 1,
      },
      {
        id: 12,
        question: 'What is a hash function?',
        options: ['A function to encrypt', 'Maps input to fixed size output', 'Sorts arrays', 'Validates JSON'],
        correctAnswer: 1,
      },
      {
        id: 13,
        question: 'What is the purpose of normalization in databases?',
        options: ['Optimize queries', 'Reduce redundancy', 'Encrypt data', 'Validate data'],
        correctAnswer: 1,
      },
      {
        id: 14,
        question: 'What is a deadlock in concurrent programming?',
        options: ['Program crash', 'Two processes waiting for each other', 'Memory leak', 'Type error'],
        correctAnswer: 1,
      },
      {
        id: 15,
        question: 'What is REST API?',
        options: ['Type of database', 'Architecture for web services', 'Programming language', 'Design pattern'],
        correctAnswer: 1,
      },
    ];
  } else {
    return [
      {
        id: 1,
        question: 'If A = 1, B = 2, C = 3... then HELLO = ?',
        options: ['52', '62', '72', '82'],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'If CODE is written as FRGH, how is BEST written?',
        options: ['CFTU', 'EHVW', 'DGUV', 'ADRQ'],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: 'What comes next? 1, 1, 2, 3, 5, 8, 13, ?',
        options: ['19', '20', '21', '22'],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: 'A is the father of B, B is the father of C, what is C to A?',
        options: ['Son', 'Grandson', 'Father', 'Brother'],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: 'If all roses are flowers and some flowers are red, then?',
        options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: 'Complete: 5, 10, 20, 40, ?',
        options: ['50', '60', '80', '100'],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: 'What is the odd one out? 2, 3, 5, 7, 9, 11',
        options: ['2', '3', '9', '11'],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: 'If TRAIN is coded as USBJO, then BRAIN is coded as?',
        options: ['AQDLM', 'CSBNJ', 'BSBNJ', 'CSBNM'],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: 'A, B, C, D, E are arranged in a circle. A is between B and D. Who is between C and E?',
        options: ['A', 'B', 'D', 'Cannot be determined'],
        correctAnswer: 3,
      },
      {
        id: 11,
        question: 'What is the next number? 121, 144, 169, 196, ?',
        options: ['215', '220', '225', '230'],
        correctAnswer: 2,
      },
      {
        id: 12,
        question: 'If 2 + 2 = 4, 3 + 3 = 9, then 4 + 4 = ?',
        options: ['12', '14', '16', '20'],
        correctAnswer: 2,
      },
      {
        id: 13,
        question: 'Complete: 1, 4, 9, 16, 25, 36, ?',
        options: ['46', '48', '49', '52'],
        correctAnswer: 2,
      },
      {
        id: 14,
        question: 'If BOOK = 4-15-15-11, then LOOK = ?',
        options: ['12-15-15-11', '12-14-14-11', '11-15-15-11', '12-15-14-11'],
        correctAnswer: 0,
      },
      {
        id: 15,
        question: 'What comes next in the pattern? 1, 2, 4, 7, 11, 16, ?',
        options: ['20', '21', '22', '23'],
        correctAnswer: 2,
      },
    ];
  }
};

const getMockInterviewQuestions = (jobRole: string): string[] => {
  const questionSets: Record<string, string[]> = {
    'Software Engineer': [
      'Tell me about yourself and your experience in software development.',
      'Explain the difference between procedural and object-oriented programming.',
      'Describe a challenging project you worked on and how you overcame obstacles.',
      'How do you ensure code quality and maintainability in your projects?',
      'What is your approach to debugging complex issues?',
    ],
    'Data Analyst': [
      'Tell me about your experience with data analysis and business intelligence.',
      'How do you handle missing or inconsistent data in your analysis?',
      'Explain a time when you used data to drive business decisions.',
      'What data visualization tools are you proficient in and why?',
      'How do you ensure data accuracy and quality in your reports?',
    ],
    'Web Developer': [
      'Tell me about your web development experience and technologies.',
      'Explain the difference between frontend and backend development.',
      'How do you ensure website performance and optimize load times?',
      'Describe your experience with responsive design and mobile optimization.',
      'What is your approach to handling cross-browser compatibility?',
    ],
    'Full Stack Developer': [
      'Describe your full stack development experience with frontend and backend.',
      'How do you approach system design for scalable applications?',
      'Explain your experience with databases and API design.',
      'Tell me about your experience with DevOps and deployment.',
      'How do you handle authentication and security in web applications?',
    ],
    'Associate Software Engineer': [
      'Tell me about yourself and your technical background.',
      'What programming languages are you most comfortable with?',
      'Describe a project where you learned something new.',
      'How do you approach learning new technologies and frameworks?',
      'What are your career goals in software development?',
    ],
  };

  return questionSets[jobRole] || questionSets['Software Engineer'];
};
