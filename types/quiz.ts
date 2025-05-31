export type QuestionType = 'multiple_choice' | 'multiple_select' | 'true_false' | 'fill_blank';

export interface QuizAnswer {
  id: string;
  answer_text: string;
  is_correct: boolean;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  order: number;
  answers: QuizAnswer[];
  explanation?: string; // Optional explanation for the answer
}

export interface QuizSettings {
  time_limit?: number; // in minutes
  shuffle_questions: boolean;
  shuffle_answers: boolean;
  max_attempts: number;
  show_results_immediately: boolean;
  show_correct_answers: boolean;
  passing_score?: number; // percentage
  allow_review: boolean;
  auto_submit: boolean; // auto submit when time runs out
}

export interface Quiz {
  id: string;
  assignment_id: string;
  title: string;
  description?: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface QuizDraft {
  questions: QuizQuestion[];
  settings: QuizSettings;
  last_saved: string;
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  answers: {
    question_id: string;
    selected_answers: string[]; // answer IDs or text for fill_blank
    is_correct: boolean;
    points_earned: number;
  }[];
  total_score: number;
  percentage: number;
  time_taken: number; // in seconds
  submitted_at: string;
  attempt_number: number;
}

export interface QuizResult {
  submission: QuizSubmission;
  quiz: Quiz;
  detailed_results: {
    question: QuizQuestion;
    student_answer: string[];
    correct_answers: string[];
    is_correct: boolean;
    points_earned: number;
  }[];
}

// Form interfaces for Quiz Builder
export interface QuizBuilderForm {
  title: string;
  description: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
}

export interface QuestionBuilderForm {
  question_text: string;
  question_type: QuestionType;
  points: number;
  answers: {
    answer_text: string;
    is_correct: boolean;
  }[];
  explanation: string;
}

// Import/Export interfaces
export interface QuizImportData {
  questions: {
    question: string;
    type: QuestionType;
    points?: number;
    answers: {
      text: string;
      correct: boolean;
    }[];
    explanation?: string;
  }[];
  settings?: Partial<QuizSettings>;
}

export interface QuizExportData {
  quiz_title: string;
  quiz_description: string;
  settings: QuizSettings;
  questions: {
    order: number;
    question: string;
    type: QuestionType;
    points: number;
    answers: {
      order: number;
      text: string;
      correct: boolean;
    }[];
    explanation?: string;
  }[];
  export_date: string;
}

// Validation interfaces
export interface QuizValidationError {
  field: string;
  message: string;
  question_index?: number;
  answer_index?: number;
}

export interface QuizValidationResult {
  isValid: boolean;
  errors: QuizValidationError[];
  warnings: QuizValidationError[];
}

// Default values
export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  time_limit: 60,
  shuffle_questions: false,
  shuffle_answers: false,
  max_attempts: 1,
  show_results_immediately: true,
  show_correct_answers: true,
  passing_score: 70,
  allow_review: true,
  auto_submit: true,
};

export const DEFAULT_QUESTION: Omit<QuizQuestion, 'id' | 'order'> = {
  question_text: '',
  question_type: 'multiple_choice',
  points: 1,
  answers: [
    { id: '', answer_text: '', is_correct: false, order: 0 },
    { id: '', answer_text: '', is_correct: false, order: 1 },
  ],
  explanation: '',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Trắc nghiệm (1 đáp án)',
  multiple_select: 'Trắc nghiệm (nhiều đáp án)',
  true_false: 'Đúng/Sai',
  fill_blank: 'Điền vào chỗ trống',
};

export const MAX_ANSWERS_PER_QUESTION = 6;
export const MIN_ANSWERS_PER_QUESTION = 2;
