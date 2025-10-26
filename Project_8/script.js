// Typing Speed Test JavaScript
class TypingSpeedTest {
    constructor() {
        this.texts = {
            common: [
                "the quick brown fox jumps over the lazy dog",
                "practice makes perfect when learning to type faster",
                "keyboard skills are essential in the digital age",
                "typing speed and accuracy both matter greatly",
                "regular practice will significantly improve your skills"
            ],
            quotes: [
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
            ],
            programming: [
                "const calculateSum = (a, b) => a + b; console.log(calculateSum(5, 3));",
                "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
                "class Calculator { constructor() { this.result = 0; } add(x) { this.result += x; return this; }}",
                "const users = users.filter(user => user.active).map(user => user.name);",
                "async function fetchData() { const response = await fetch('/api/data'); return response.json(); }"
            ],
            literature: [
                "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
                "All happy families are alike; each unhappy family is unhappy in its own way. - Leo Tolstoy",
                "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
                "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse.",
                "Happy families are all alike; every unhappy family is unhappy in its own way. - Anna Karenina"
            ],
            random: [
                "The majestic mountains stood tall against the bright blue summer sky.",
                "Scientific research continues to push the boundaries of human knowledge and understanding.",
                "Digital transformation has revolutionized how businesses operate in the modern economy.",
                "Environmental conservation requires global cooperation and sustainable practices.",
                "Artificial intelligence and machine learning are transforming various industries worldwide."
            ]
        };

        this.currentText = '';
        this.userInput = '';
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.testActive = false;
        this.currentCharIndex = 0;

        // Statistics
        this.stats = JSON.parse(localStorage.getItem('typingStats')) || {
            testsTaken: 0,
            bestWpm: 0,
            averageWpm: 0,
            totalWpm: 0,
            history: []
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadNewText();
        this.updateDisplay();
        this.initializeChart();
    }

    bindEvents() {
        // Control elements
        document.getElementById('textCategory').addEventListener('change', () => this.loadNewText());
        document.getElementById('difficulty').addEventListener('change', () => this.loadNewText());

        // Action buttons
        document.getElementById('startTest').addEventListener('click', () => this.startTest());
        document.getElementById('resetTest').addEventListener('click', () => this.resetTest());
        document.getElementById('newText').addEventListener('click', () => this.loadNewText());
        document.getElementById('tryAgain').addEventListener('click', () => this.resetTest());
        document.getElementById('saveResult').addEventListener('click', () => this.saveResult());

        // Typing input
        document.getElementById('typingInput').addEventListener('input', (e) => this.handleInput(e));
        document.getElementById('typingInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }

    loadNewText() {
        const category = document.getElementById('textCategory').value;
        const difficulty = document.getElementById('difficulty').value;

        let textArray = this.texts[category];
        let selectedText = textArray[Math.floor(Math.random() * textArray.length)];

        // Adjust text based on difficulty
        if (difficulty === 'easy') {
            selectedText = selectedText.toLowerCase();
        } else if (difficulty === 'hard') {
            selectedText = selectedText + ' ' + this.getAdditionalText();
        } else if (difficulty === 'expert') {
            selectedText = this.capitalizeRandomWords(selectedText) + ' ' + this.getAdditionalText();
        }

        this.currentText = selectedText;
        this.displayText();
        this.resetTest();
    }

    getAdditionalText() {
        const additional = [
            "Additional complexity makes typing more challenging and improves skills.",
            "Practicing with longer texts helps build endurance and consistency.",
            "Varied sentence structures enhance adaptability and typing versatility."
        ];
        return additional[Math.floor(Math.random() * additional.length)];
    }

    capitalizeRandomWords(text) {
        return text.split(' ').map(word => {
            return Math.random() > 0.7 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        }).join(' ');
    }

    displayText() {
        const textDisplay = document.getElementById('textDisplay');
        textDisplay.innerHTML = '';

        this.currentText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            if (index === 0) {
                span.className = 'char current';
            }
            textDisplay.appendChild(span);
        });
    }

    startTest() {
        this.testActive = true;
        this.startTime = new Date();
        this.currentCharIndex = 0;

        document.getElementById('typingInput').disabled = false;
        document.getElementById('typingInput').focus();
        document.getElementById('startTest').disabled = true;

        this.startTimer();
        this.updateDisplay();
    }

    startTimer() {
        const timeLimit = parseInt(document.getElementById('timeLimit').value);
        let timeLeft = timeLimit;

        document.getElementById('timer').textContent = timeLeft;

        this.timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;

            if (timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    handleInput(e) {
        if (!this.testActive) {
            this.startTest();
        }

        this.userInput = e.target.value;
        this.currentCharIndex = this.userInput.length;
        this.checkInput();
        this.updateStats();
        this.updateProgress();

        // Auto-end test if user completes the text
        if (this.userInput === this.currentText) {
            setTimeout(() => this.endTest(), 100);
        }
    }

    checkInput() {
        const textDisplay = document.getElementById('textDisplay');
        const chars = textDisplay.querySelectorAll('.char');

        chars.forEach((char, index) => {
            char.className = 'char';

            if (index < this.userInput.length) {
                if (this.userInput[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            }

            if (index === this.userInput.length) {
                char.classList.add('current');
            }
        });
    }

    updateStats() {
        if (!this.startTime) return;

        const currentTime = new Date();
        const timeElapsed = (currentTime - this.startTime) / 1000 / 60; // in minutes

        // Calculate WPM (words per minute)
        const wordsTyped = this.userInput.length / 5;
        const wpm = Math.round(wordsTyped / timeElapsed);

        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < this.userInput.length; i++) {
            if (this.userInput[i] === this.currentText[i]) {
                correctChars++;
            }
        }
        const accuracy = this.userInput.length > 0 ? Math.round((correctChars / this.userInput.length) * 100) : 100;

        // Calculate errors
        const errors = this.userInput.length - correctChars;

        document.getElementById('wpm').textContent = isNaN(wpm) ? 0 : wpm;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('errors').textContent = errors;
    }

    updateProgress() {
        const progress = (this.userInput.length / this.currentText.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.round(progress) + '%';
    }

    endTest() {
        this.testActive = false;
        this.endTime = new Date();

        clearInterval(this.timerInterval);
        document.getElementById('typingInput').disabled = true;

        this.calculateFinalResults();
        this.showResults();
    }

    calculateFinalResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60;
        const wordsTyped = this.userInput.length / 5;
        const wpm = Math.round(wordsTyped / timeElapsed);

        let correctChars = 0;
        for (let i = 0; i < this.userInput.length; i++) {
            if (this.userInput[i] === this.currentText[i]) {
                correctChars++;
            }
        }
        const accuracy = Math.round((correctChars / this.userInput.length) * 100) || 0;
        const errors = this.userInput.length - correctChars;

        // Calculate score (WPM * accuracy percentage)
        const score = Math.round(wpm * (accuracy / 100));

        this.finalResults = {
            wpm: isNaN(wpm) ? 0 : wpm,
            accuracy: accuracy,
            errors: errors,
            score: score,
            timeElapsed: Math.round((this.endTime - this.startTime) / 1000)
        };
    }

    showResults() {
        document.getElementById('finalWpm').textContent = this.finalResults.wpm;
        document.getElementById('finalAccuracy').textContent = this.finalResults.accuracy + '%';
        document.getElementById('finalErrors').textContent = this.finalResults.errors;
        document.getElementById('finalScore').textContent = this.finalResults.score;

        document.getElementById('resultsPanel').classList.remove('hidden');

        // Update overall statistics
        this.updateOverallStats();
    }

    updateOverallStats() {
        this.stats.testsTaken++;
        this.stats.totalWpm += this.finalResults.wpm;
        this.stats.averageWpm = Math.round(this.stats.totalWpm / this.stats.testsTaken);

        if (this.finalResults.wpm > this.stats.bestWpm) {
            this.stats.bestWpm = this.finalResults.wpm;
        }

        // Add to history (keep last 10 tests)
        this.stats.history.unshift({
            wpm: this.finalResults.wpm,
            accuracy: this.finalResults.accuracy,
            timestamp: new Date().toISOString()
        });

        if (this.stats.history.length > 10) {
            this.stats.history = this.stats.history.slice(0, 10);
        }

        this.saveStats();
        this.updateProgressDisplay();
        this.updateChart();
    }

    resetTest() {
        this.testActive = false;
        this.userInput = '';
        this.startTime = null;
        this.currentCharIndex = 0;

        clearInterval(this.timerInterval);

        const timeLimit = parseInt(document.getElementById('timeLimit').value);
        document.getElementById('timer').textContent = timeLimit;
        document.getElementById('wpm').textContent = '0';
        document.getElementById('accuracy').textContent = '100%';
        document.getElementById('errors').textContent = '0';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';

        document.getElementById('typingInput').value = '';
        document.getElementById('typingInput').disabled = false;
        document.getElementById('startTest').disabled = false;
        document.getElementById('resultsPanel').classList.add('hidden');

        this.displayText();
    }

    saveResult() {
        // In a real application, this would save to a database
        // For now, we'll just show a confirmation
        alert('Result saved to your progress history!');
    }

    saveStats() {
        localStorage.setItem('typingStats', JSON.stringify(this.stats));
    }

    updateProgressDisplay() {
        document.getElementById('bestWpm').textContent = this.stats.bestWpm;
        document.getElementById('avgWpm').textContent = this.stats.averageWpm;
        document.getElementById('testsTaken').textContent = this.stats.testsTaken;
    }

    initializeChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'WPM Progress',
                    data: [],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Words Per Minute'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Recent Tests'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `WPM: ${context.parsed.y}`;
                            }
                        }
                    }
                }
            }
        });

        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;

        const labels = this.stats.history.map((_, index) => `Test ${this.stats.history.length - index}`);
        const data = this.stats.history.map(test => test.wpm);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

// Initialize the typing test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTest();
});