import {
  Quiz,
  QuizQuestion,
  QuizAnswer,
  QuizValidationError,
  QuizValidationResult,
  QuizBuilderForm,
  QuestionType,
  MIN_ANSWERS_PER_QUESTION,
  MAX_ANSWERS_PER_QUESTION,
} from "@/types/quiz";

// ID Generation
export const generateQuizId = (): string => {
  return `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateQuestionId = (): string => {
  return `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAnswerId = (): string => {
  return `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validation Functions
export const validateQuestion = (question: QuizQuestion): QuizValidationError[] => {
  const errors: QuizValidationError[] = [];

  // Validate question text
  if (!question.question_text.trim()) {
    errors.push({
      field: "question_text",
      message: "Câu hỏi không được để trống",
    });
  }

  // Validate points
  if (question.points <= 0) {
    errors.push({
      field: "points",
      message: "Điểm số phải lớn hơn 0",
    });
  }

  // Validate answers based on question type
  if (question.question_type === 'fill_blank') {
    if (question.answers.length !== 1) {
      errors.push({
        field: "answers",
        message: "Câu hỏi điền vào chỗ trống phải có đúng 1 đáp án",
      });
    } else if (!question.answers[0].answer_text.trim()) {
      errors.push({
        field: "answers",
        message: "Đáp án không được để trống",
        answer_index: 0,
      });
    }
  } else {
    // Validate number of answers
    if (question.answers.length < MIN_ANSWERS_PER_QUESTION) {
      errors.push({
        field: "answers",
        message: `Cần ít nhất ${MIN_ANSWERS_PER_QUESTION} đáp án`,
      });
    }

    if (question.answers.length > MAX_ANSWERS_PER_QUESTION) {
      errors.push({
        field: "answers",
        message: `Tối đa ${MAX_ANSWERS_PER_QUESTION} đáp án`,
      });
    }

    // Validate answer texts
    question.answers.forEach((answer, index) => {
      if (!answer.answer_text.trim()) {
        errors.push({
          field: "answers",
          message: `Đáp án ${index + 1} không được để trống`,
          answer_index: index,
        });
      }
    });

    // Validate correct answers
    const correctAnswers = question.answers.filter(a => a.is_correct);
    
    if (correctAnswers.length === 0) {
      errors.push({
        field: "answers",
        message: "Phải có ít nhất một đáp án đúng",
      });
    }

    if (question.question_type === 'multiple_choice' && correctAnswers.length > 1) {
      errors.push({
        field: "answers",
        message: "Câu hỏi trắc nghiệm chỉ được có một đáp án đúng",
      });
    }

    if (question.question_type === 'true_false') {
      if (question.answers.length !== 2) {
        errors.push({
          field: "answers",
          message: "Câu hỏi Đúng/Sai phải có đúng 2 đáp án",
        });
      }
      if (correctAnswers.length !== 1) {
        errors.push({
          field: "answers",
          message: "Câu hỏi Đúng/Sai phải có đúng 1 đáp án đúng",
        });
      }
    }
  }

  return errors;
};

export const validateQuiz = (quizData: QuizBuilderForm): QuizValidationResult => {
  const errors: QuizValidationError[] = [];
  const warnings: QuizValidationError[] = [];

  // Validate basic info
  if (!quizData.title.trim()) {
    errors.push({
      field: "title",
      message: "Tiêu đề quiz không được để trống",
    });
  }

  // Validate questions
  if (quizData.questions.length === 0) {
    errors.push({
      field: "questions",
      message: "Quiz phải có ít nhất một câu hỏi",
    });
  }

  // Validate each question
  quizData.questions.forEach((question, index) => {
    const questionErrors = validateQuestion(question);
    questionErrors.forEach(error => {
      errors.push({
        ...error,
        question_index: index,
        message: `Câu ${index + 1}: ${error.message}`,
      });
    });
  });

  // Warnings
  if (quizData.questions.length < 5) {
    warnings.push({
      field: "questions",
      message: "Quiz có ít câu hỏi, nên thêm câu hỏi để đánh giá tốt hơn",
    });
  }

  const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0);
  if (totalPoints < 10) {
    warnings.push({
      field: "points",
      message: "Tổng điểm quiz thấp, nên tăng điểm cho các câu hỏi",
    });
  }

  if (quizData.settings.time_limit && quizData.settings.time_limit < quizData.questions.length * 2) {
    warnings.push({
      field: "time_limit",
      message: "Thời gian làm bài có thể quá ngắn so với số câu hỏi",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Quiz Manipulation Functions
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffleQuiz = (quiz: Quiz): Quiz => {
  let shuffledQuestions = quiz.settings.shuffle_questions 
    ? shuffleArray(quiz.questions)
    : quiz.questions;

  if (quiz.settings.shuffle_answers) {
    shuffledQuestions = shuffledQuestions.map(question => ({
      ...question,
      answers: question.question_type !== 'true_false' 
        ? shuffleArray(question.answers)
        : question.answers,
    }));
  }

  return {
    ...quiz,
    questions: shuffledQuestions,
  };
};

// Scoring Functions
export const calculateQuestionScore = (
  question: QuizQuestion,
  userAnswers: string[]
): number => {
  const correctAnswers = question.answers
    .filter(a => a.is_correct)
    .map(a => a.id);

  if (question.question_type === 'fill_blank') {
    const userAnswer = userAnswers[0]?.toLowerCase().trim() || '';
    const correctAnswer = question.answers[0]?.answer_text.toLowerCase().trim() || '';
    return userAnswer === correctAnswer ? question.points : 0;
  }

  // For multiple choice questions
  const isCorrect = userAnswers.length === correctAnswers.length &&
    userAnswers.every(id => correctAnswers.includes(id));

  return isCorrect ? question.points : 0;
};

export const calculateQuizScore = (
  quiz: Quiz,
  userAnswers: Record<string, string[]>
): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionResults: {
    questionId: string;
    score: number;
    maxScore: number;
    isCorrect: boolean;
  }[];
} => {
  const questionResults = quiz.questions.map(question => {
    const answers = userAnswers[question.id] || [];
    const score = calculateQuestionScore(question, answers);
    
    return {
      questionId: question.id,
      score,
      maxScore: question.points,
      isCorrect: score === question.points,
    };
  });

  const totalScore = questionResults.reduce((sum, result) => sum + result.score, 0);
  const maxScore = quiz.total_points;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    totalScore,
    maxScore,
    percentage,
    questionResults,
  };
};

// Import/Export Functions
export const exportQuizToJSON = (quiz: Quiz): string => {
  const exportData = {
    quiz_title: quiz.title,
    quiz_description: quiz.description,
    settings: quiz.settings,
    questions: quiz.questions.map(q => ({
      order: q.order,
      question: q.question_text,
      type: q.question_type,
      points: q.points,
      answers: q.answers.map(a => ({
        order: a.order,
        text: a.answer_text,
        correct: a.is_correct,
      })),
      explanation: q.explanation,
    })),
    export_date: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
};

export const exportQuizToCSV = (quiz: Quiz): string => {
  const headers = ['Question', 'Type', 'Points', 'Answer 1', 'Correct 1', 'Answer 2', 'Correct 2', 'Answer 3', 'Correct 3', 'Answer 4', 'Correct 4', 'Explanation'];
  
  const rows = quiz.questions.map(question => {
    const row = [
      `"${question.question_text.replace(/"/g, '""')}"`,
      question.question_type,
      question.points.toString(),
    ];

    // Add up to 4 answers
    for (let i = 0; i < 4; i++) {
      const answer = question.answers[i];
      if (answer) {
        row.push(`"${answer.answer_text.replace(/"/g, '""')}"`);
        row.push(answer.is_correct ? 'TRUE' : 'FALSE');
      } else {
        row.push('', '');
      }
    }

    row.push(`"${(question.explanation || '').replace(/"/g, '""')}"`);
    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

// Time Functions
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const parseTimeLimit = (minutes: number): number => {
  return minutes * 60; // Convert to seconds
};

// Question Type Helpers
export const getDefaultAnswersForType = (type: QuestionType): Omit<QuizAnswer, 'id'>[] => {
  switch (type) {
    case 'true_false':
      return [
        { answer_text: 'Đúng', is_correct: false, order: 0 },
        { answer_text: 'Sai', is_correct: false, order: 1 },
      ];
    case 'fill_blank':
      return [
        { answer_text: '', is_correct: true, order: 0 },
      ];
    default:
      return [
        { answer_text: '', is_correct: false, order: 0 },
        { answer_text: '', is_correct: false, order: 1 },
      ];
  }
};

export const isQuestionComplete = (question: QuizQuestion): boolean => {
  const errors = validateQuestion(question);
  return errors.length === 0;
};

export const getQuestionCompletionStatus = (questions: QuizQuestion[]): {
  completed: number;
  total: number;
  percentage: number;
} => {
  const completed = questions.filter(isQuestionComplete).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};
