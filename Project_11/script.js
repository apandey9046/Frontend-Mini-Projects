// Quiz Master - Multiple Choice Quiz App

class QuizApp {
    constructor() {
        this.quizData = {
            general: {
                name: "General Knowledge",
                questions: [
                    {
                        question: "What is the capital of France?",
                        options: ["London", "Berlin", "Paris", "Madrid"],
                        correct: 2
                    },
                    {
                        question: "Which planet is known as the Red Planet?",
                        options: ["Venus", "Mars", "Jupiter", "Saturn"],
                        correct: 1
                    },
                    {
                        question: "Who painted the Mona Lisa?",
                        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                        correct: 2
                    },
                    {
                        question: "What is the largest ocean on Earth?",
                        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                        correct: 3
                    },
                    {
                        question: "Which element has the chemical symbol 'O'?",
                        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
                        correct: 1
                    }
                ]
            },
            science: {
                name: "Science & Technology",
                questions: [
                    {
                        question: "What is the speed of light in vacuum?",
                        options: ["299,792,458 m/s", "150,000,000 m/s", "1,080,000,000 km/h", "671,000,000 mph"],
                        correct: 0
                    },
                    {
                        question: "Which programming language is known as the 'language of the web'?",
                        options: ["Python", "Java", "JavaScript", "C++"],
                        correct: 2
                    },
                    {
                        question: "What does CPU stand for?",
                        options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unit", "Central Program Utility"],
                        correct: 0
                    },
                    {
                        question: "Which gas do plants absorb from the atmosphere?",
                        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                        correct: 2
                    }
                ]
            },
            history: {
                name: "History",
                questions: [
                    {
                        question: "In which year did World War II end?",
                        options: ["1944", "1945", "1946", "1947"],
                        correct: 1
                    },
                    {
                        question: "Who was the first President of the United States?",
                        options: ["Thomas Jefferson", "John Adams", "George Washington", "James Madison"],
                        correct: 2
                    },
                    {
                        question: "Which ancient civilization built the pyramids?",
                        options: ["Romans", "Greeks", "Egyptians", "Mayans"],
                        correct: 2
                    },
                    {
                        question: "When was the Declaration of Independence signed?",
                        options: ["1774", "1775", "1776", "1777"],
                        correct: 2
                    }
                ]
            }
        };

        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.showQuizSelection();
    }

    setupEventListeners() {
        // Quiz selection
        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.startQuiz(category);
            });
        });

        // Quiz navigation
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitQuiz();
        });

        // Results screen
        document.getElementById('restart-quiz').addEventListener('click', () => {
            this.showQuizSelection();
        });

        document.getElementById('review-answers').addEventListener('click', () => {
            this.reviewAnswers();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    showQuizSelection() {
        document.getElementById('quiz-selection').classList.add('active');
        document.getElementById('quiz-screen').classList.remove('active');
        document.getElementById('results-screen').classList.remove('active');
        
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
    }

    startQuiz(category) {
        this.currentQuiz = this.quizData[category];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(this.currentQuiz.questions.length).fill(null);

        document.getElementById('quiz-selection').classList.remove('active');
        document.getElementById('quiz-screen').classList.add('active');
        
        this.updateQuizHeader(category);
        this.displayQuestion();
        this.updateNavigation();
    }

    updateQuizHeader(category) {
        document.getElementById('quiz-category').textContent = this.currentQuiz.name;
        document.getElementById('current-score').textContent = this.score;
        this.updateProgress();
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('question-count').textContent = 
            `Question ${this.currentQuestionIndex + 1}/${this.currentQuiz.questions.length}`;
    }

    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const optionsContainer = document.getElementById('options-container');
        
        document.getElementById('question-text').textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionBtn.classList.add('selected');
            }
            
            optionBtn.innerHTML = `
                <span class="option-number">${index + 1}</span>
                <span class="option-text">${option}</span>
            `;
            
            optionBtn.addEventListener('click', () => {
                this.selectAnswer(index);
            });
            
            optionsContainer.appendChild(optionBtn);
        });

        this.updateProgress();
    }

    selectAnswer(optionIndex) {
        // Remove selected class from all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        document.querySelectorAll('.option-btn')[optionIndex].classList.add('selected');
        
        // Store user's answer
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Enable next button
        document.getElementById('next-btn').disabled = false;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateNavigation();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateNavigation();
        }
    }

    updateNavigation() {
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('next-btn').disabled = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        
        const showSubmit = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        document.getElementById('next-btn').style.display = showSubmit ? 'none' : 'flex';
        document.getElementById('submit-btn').style.display = showSubmit ? 'flex' : 'none';
    }

    submitQuiz() {
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                this.score++;
            }
        });
    }

    showResults() {
        document.getElementById('quiz-screen').classList.remove('active');
        document.getElementById('results-screen').classList.add('active');
        
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('correct-answers').textContent = this.score;
        document.getElementById('total-questions').textContent = totalQuestions;
        document.getElementById('percentage').textContent = `${percentage}%`;
        
        this.updateResultsMessage(percentage);
    }

    updateResultsMessage(percentage) {
        const messageElement = document.getElementById('results-message');
        let message = '';
        let title = '';
        
        if (percentage >= 90) {
            title = 'Excellent!';
            message = 'Outstanding performance! You have mastered this topic.';
        } else if (percentage >= 70) {
            title = 'Great Job!';
            message = 'Very good score! You have a solid understanding of the material.';
        } else if (percentage >= 50) {
            title = 'Good Effort';
            message = 'Not bad! With a little more practice, you can improve further.';
        } else {
            title = 'Keep Practicing';
            message = 'Don\'t worry! Review the material and try again. Practice makes perfect.';
        }
        
        messageElement.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;
    }

    reviewAnswers() {
        // For now, just restart the quiz
        // In a full implementation, this would show detailed answer review
        this.startQuiz(Object.keys(this.quizData).find(key => this.quizData[key] === this.currentQuiz));
    }

    handleKeyboardShortcuts(e) {
        if (!document.getElementById('quiz-screen').classList.contains('active')) return;
        
        // Number keys 1-4 for answer selection
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex < this.currentQuiz.questions[this.currentQuestionIndex].options.length) {
                this.selectAnswer(optionIndex);
            }
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft') {
            this.previousQuestion();
        } else if (e.key === 'ArrowRight') {
            if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.submitQuiz();
            }
        }
        
        // Enter key to submit on last question
        if (e.key === 'Enter' && this.currentQuestionIndex === this.currentQuiz.questions.length - 1) {
            this.submitQuiz();
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});