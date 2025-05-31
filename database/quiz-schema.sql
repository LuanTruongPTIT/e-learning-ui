-- Quiz Builder Database Schema
-- This schema extends the existing assignment system with quiz functionality

-- Table for storing quiz metadata
CREATE TABLE quizzes (
    id VARCHAR(255) PRIMARY KEY,
    assignment_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Quiz settings
    time_limit INT, -- in minutes, NULL means no limit
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_answers BOOLEAN DEFAULT FALSE,
    max_attempts INT DEFAULT 1,
    show_results_immediately BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    passing_score DECIMAL(5,2), -- percentage, NULL means no passing requirement
    allow_review BOOLEAN DEFAULT TRUE,
    auto_submit BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    total_points DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    
    -- Foreign keys
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    -- Indexes
    INDEX idx_quiz_assignment (assignment_id),
    INDEX idx_quiz_created_by (created_by),
    INDEX idx_quiz_created_at (created_at)
);

-- Table for storing quiz questions
CREATE TABLE quiz_questions (
    id VARCHAR(255) PRIMARY KEY,
    quiz_id VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'multiple_select', 'true_false', 'fill_blank') NOT NULL,
    points DECIMAL(5,2) DEFAULT 1.0,
    order_index INT NOT NULL,
    explanation TEXT, -- optional explanation for the answer
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_question_quiz (quiz_id),
    INDEX idx_question_order (quiz_id, order_index),
    
    -- Constraints
    UNIQUE KEY unique_question_order (quiz_id, order_index)
);

-- Table for storing quiz answers
CREATE TABLE quiz_answers (
    id VARCHAR(255) PRIMARY KEY,
    question_id VARCHAR(255) NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_answer_question (question_id),
    INDEX idx_answer_order (question_id, order_index),
    INDEX idx_answer_correct (question_id, is_correct),
    
    -- Constraints
    UNIQUE KEY unique_answer_order (question_id, order_index)
);

-- Table for storing student quiz submissions
CREATE TABLE quiz_submissions (
    id VARCHAR(255) PRIMARY KEY,
    quiz_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    attempt_number INT DEFAULT 1,
    
    -- Submission data
    answers JSON, -- stores student answers in format: {"question_id": ["answer_id1", "answer_id2"]}
    total_score DECIMAL(8,2) DEFAULT 0,
    max_score DECIMAL(8,2) DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0,
    time_taken INT, -- in seconds
    
    -- Status and timing
    status ENUM('in_progress', 'submitted', 'graded', 'expired') DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    graded_at TIMESTAMP NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id),
    
    -- Indexes
    INDEX idx_submission_quiz (quiz_id),
    INDEX idx_submission_student (student_id),
    INDEX idx_submission_status (status),
    INDEX idx_submission_attempt (quiz_id, student_id, attempt_number),
    
    -- Constraints
    UNIQUE KEY unique_submission_attempt (quiz_id, student_id, attempt_number)
);

-- Table for storing detailed question results
CREATE TABLE quiz_question_results (
    id VARCHAR(255) PRIMARY KEY,
    submission_id VARCHAR(255) NOT NULL,
    question_id VARCHAR(255) NOT NULL,
    selected_answers JSON, -- stores selected answer IDs or text for fill_blank
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned DECIMAL(5,2) DEFAULT 0,
    points_possible DECIMAL(5,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (submission_id) REFERENCES quiz_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id),
    
    -- Indexes
    INDEX idx_result_submission (submission_id),
    INDEX idx_result_question (question_id),
    INDEX idx_result_correct (is_correct),
    
    -- Constraints
    UNIQUE KEY unique_submission_question (submission_id, question_id)
);

-- Table for storing quiz templates (for reuse)
CREATE TABLE quiz_templates (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_data JSON, -- stores the complete quiz structure
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    
    -- Foreign keys
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    -- Indexes
    INDEX idx_template_category (category),
    INDEX idx_template_public (is_public),
    INDEX idx_template_created_by (created_by),
    INDEX idx_template_usage (usage_count DESC)
);

-- Table for quiz analytics and statistics
CREATE TABLE quiz_analytics (
    id VARCHAR(255) PRIMARY KEY,
    quiz_id VARCHAR(255) NOT NULL,
    
    -- Aggregate statistics
    total_attempts INT DEFAULT 0,
    total_completions INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_time_taken INT DEFAULT 0, -- in seconds
    pass_rate DECIMAL(5,2) DEFAULT 0, -- percentage
    
    -- Question-level analytics
    question_stats JSON, -- stores per-question statistics
    
    -- Time-based data
    date_calculated DATE NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_analytics_quiz (quiz_id),
    INDEX idx_analytics_date (date_calculated),
    
    -- Constraints
    UNIQUE KEY unique_quiz_date (quiz_id, date_calculated)
);

-- Update assignments table to include quiz_id reference
ALTER TABLE assignments 
ADD COLUMN quiz_id VARCHAR(255) NULL,
ADD FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL;

-- Views for common queries

-- View for quiz overview with statistics
CREATE VIEW quiz_overview AS
SELECT 
    q.id,
    q.title,
    q.description,
    q.total_points,
    q.time_limit,
    q.max_attempts,
    q.created_at,
    u.name as creator_name,
    COUNT(DISTINCT qq.id) as question_count,
    COUNT(DISTINCT qs.id) as submission_count,
    AVG(qs.percentage) as average_score,
    COUNT(DISTINCT CASE WHEN qs.status = 'submitted' THEN qs.student_id END) as completion_count
FROM quizzes q
LEFT JOIN users u ON q.created_by = u.id
LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
LEFT JOIN quiz_submissions qs ON q.id = qs.quiz_id
GROUP BY q.id, q.title, q.description, q.total_points, q.time_limit, q.max_attempts, q.created_at, u.name;

-- View for student quiz progress
CREATE VIEW student_quiz_progress AS
SELECT 
    qs.student_id,
    qs.quiz_id,
    q.title as quiz_title,
    qs.attempt_number,
    qs.status,
    qs.percentage,
    qs.time_taken,
    qs.submitted_at,
    CASE 
        WHEN q.passing_score IS NULL THEN 'completed'
        WHEN qs.percentage >= q.passing_score THEN 'passed'
        ELSE 'failed'
    END as result_status
FROM quiz_submissions qs
JOIN quizzes q ON qs.quiz_id = q.id
WHERE qs.status IN ('submitted', 'graded');

-- View for question difficulty analysis
CREATE VIEW question_difficulty AS
SELECT 
    qq.id as question_id,
    qq.question_text,
    qq.question_type,
    qq.points,
    COUNT(qr.id) as total_attempts,
    SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) as correct_attempts,
    ROUND(
        (SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(qr.id)), 
        2
    ) as success_rate,
    CASE 
        WHEN (SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(qr.id)) >= 80 THEN 'Easy'
        WHEN (SUM(CASE WHEN qr.is_correct THEN 1 ELSE 0 END) * 100.0 / COUNT(qr.id)) >= 50 THEN 'Medium'
        ELSE 'Hard'
    END as difficulty_level
FROM quiz_questions qq
LEFT JOIN quiz_question_results qr ON qq.id = qr.question_id
GROUP BY qq.id, qq.question_text, qq.question_type, qq.points
HAVING COUNT(qr.id) > 0;

-- Triggers for maintaining data consistency

-- Trigger to update quiz total_points when questions are added/updated/deleted
DELIMITER //
CREATE TRIGGER update_quiz_total_points
AFTER INSERT ON quiz_questions
FOR EACH ROW
BEGIN
    UPDATE quizzes 
    SET total_points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM quiz_questions 
        WHERE quiz_id = NEW.quiz_id
    )
    WHERE id = NEW.quiz_id;
END//

CREATE TRIGGER update_quiz_total_points_on_update
AFTER UPDATE ON quiz_questions
FOR EACH ROW
BEGIN
    UPDATE quizzes 
    SET total_points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM quiz_questions 
        WHERE quiz_id = NEW.quiz_id
    )
    WHERE id = NEW.quiz_id;
END//

CREATE TRIGGER update_quiz_total_points_on_delete
AFTER DELETE ON quiz_questions
FOR EACH ROW
BEGIN
    UPDATE quizzes 
    SET total_points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM quiz_questions 
        WHERE quiz_id = OLD.quiz_id
    )
    WHERE id = OLD.quiz_id;
END//
DELIMITER ;

-- Sample data for testing
INSERT INTO quizzes (id, assignment_id, title, description, time_limit, max_attempts, created_by) VALUES
('quiz-1', 'assignment-1', 'JavaScript Basics Quiz', 'Test your knowledge of JavaScript fundamentals', 30, 2, 'teacher-1'),
('quiz-2', 'assignment-2', 'HTML/CSS Quiz', 'Assessment of HTML and CSS skills', 45, 1, 'teacher-1');

INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, points, order_index) VALUES
('q1', 'quiz-1', 'What is the correct way to declare a variable in JavaScript?', 'multiple_choice', 2, 0),
('q2', 'quiz-1', 'JavaScript is a compiled language.', 'true_false', 1, 1),
('q3', 'quiz-1', 'Which of the following are JavaScript data types?', 'multiple_select', 3, 2);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, order_index) VALUES
('a1', 'q1', 'var myVar = 5;', TRUE, 0),
('a2', 'q1', 'variable myVar = 5;', FALSE, 1),
('a3', 'q1', 'v myVar = 5;', FALSE, 2),
('a4', 'q2', 'True', FALSE, 0),
('a5', 'q2', 'False', TRUE, 1),
('a6', 'q3', 'String', TRUE, 0),
('a7', 'q3', 'Number', TRUE, 1),
('a8', 'q3', 'Boolean', TRUE, 2),
('a9', 'q3', 'Character', FALSE, 3);
