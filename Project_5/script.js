// Memory Game JavaScript
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        this.currentDifficulty = 'easy';
        
        this.difficulties = {
            easy: { rows: 4, cols: 4, totalPairs: 8 },
            medium: { rows: 4, cols: 5, totalPairs: 10 },
            hard: { rows: 5, cols: 6, totalPairs: 15 }
        };

        this.icons = [
            'fas fa-heart', 'fas fa-star', 'fas fa-moon', 'fas fa-sun',
            'fas fa-cloud', 'fas fa-bolt', 'fas fa-leaf', 'fas fa-gem',
            'fas fa-football-ball', 'fas fa-basketball-ball', 'fas fa-music',
            'fas fa-camera', 'fas fa-gamepad', 'fas fa-car', 'fas fa-plane',
            'fas fa-tree', 'fas fa-umbrella', 'fas fa-flag', 'fas fa-key',
            'fas fa-gift', 'fas fa-bell', 'fas fa-anchor', 'fas fa-compass'
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.setDifficulty('easy');
        this.updateDisplay();
    }

    bindEvents() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.difficulty;
                this.setDifficulty(difficulty);
            });
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Update active button
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });

        this.restartGame();
    }

    generateCards() {
        const difficulty = this.difficulties[this.currentDifficulty];
        const totalPairs = difficulty.totalPairs;
        
        // Select random icons for this game
        const selectedIcons = this.shuffleArray([...this.icons]).slice(0, totalPairs);
        
        // Create pairs
        this.cards = [...selectedIcons, ...selectedIcons];
        this.cards = this.shuffleArray(this.cards);
        
        this.renderBoard();
    }

    renderBoard() {
        const board = document.getElementById('gameBoard');
        const difficulty = this.difficulties[this.currentDifficulty];
        
        // Set grid layout
        board.style.gridTemplateColumns = `repeat(${difficulty.cols}, 1fr)`;
        
        // Clear board
        board.innerHTML = '';
        
        // Create cards
        this.cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.icon = icon;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <i class="${icon}"></i>
                    </div>
                    <div class="card-back">
                        <i class="fas fa-question"></i>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.flipCard(card));
            board.appendChild(card);
        });
    }

    flipCard(card) {
        // Don't allow flipping if: card is already flipped, two cards are already flipped, or card is matched
        if (card.classList.contains('flipped') || 
            this.flippedCards.length === 2 || 
            card.classList.contains('matched')) {
            return;
        }

        // Start timer on first move
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }

        // Flip the card
        card.classList.add('flipped');
        this.flippedCards.push(card);

        // Check for match when two cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.dataset.icon === card2.dataset.icon;

        if (isMatch) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }
    }

    handleMatch() {
        this.flippedCards.forEach(card => {
            card.classList.add('matched');
        });

        this.matchedPairs++;
        this.flippedCards = [];

        // Check for win
        if (this.matchedPairs === this.difficulties[this.currentDifficulty].totalPairs) {
            setTimeout(() => this.handleWin(), 500);
        }
    }

    handleMismatch() {
        setTimeout(() => {
            this.flippedCards.forEach(card => {
                card.classList.remove('flipped');
            });
            this.flippedCards = [];
        }, 1000);
    }

    handleWin() {
        this.stopTimer();
        
        // Create celebration message
        const celebration = document.createElement('div');
        celebration.className = 'celebration-message';
        celebration.innerHTML = `
            <h3>🎉 Congratulations! 🎉</h3>
            <p>You completed the ${this.currentDifficulty} level!</p>
            <p>Moves: ${this.moves} | Time: ${this.formatTime(this.timer)}</p>
            <button class="game-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
                Close
            </button>
        `;
        
        document.body.appendChild(celebration);
    }

    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateDisplay() {
        document.getElementById('timer').textContent = this.formatTime(this.timer);
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('matches').textContent = `${this.matchedPairs}/${this.difficulties[this.currentDifficulty].totalPairs}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    restartGame() {
        this.stopTimer();
        
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        
        this.generateCards();
        this.updateDisplay();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});