// Tic Tac Toe Game JavaScript
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'ai'; // 'ai' or 'two-player'
        this.difficulty = 'easy'; // 'easy', 'medium', 'hard', 'impossible'

        // Statistics
        this.stats = {
            wins: parseInt(localStorage.getItem('ticTacToeWins')) || 0,
            losses: parseInt(localStorage.getItem('ticTacToeLosses')) || 0,
            draws: parseInt(localStorage.getItem('ticTacToeDraws')) || 0
        };

        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.renderBoard();
    }

    bindEvents() {
        // Cell clicks
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.handleCellClick(index);
            });
        });

        // Game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setGameMode(e.target.dataset.mode);
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(e.target.dataset.difficulty);
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Control buttons
        document.getElementById('newGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetStatsBtn').addEventListener('click', () => this.resetStats());
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        // Human player's move
        this.makeMove(index, this.currentPlayer);

        if (this.checkGameResult()) return;

        // AI's turn in AI mode
        if (this.gameMode === 'ai' && this.gameActive) {
            setTimeout(() => {
                this.aiMove();
                this.checkGameResult();
            }, 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.renderBoard();

        // Play sound effect
        this.playSound('move');

        // Switch player for two-player mode
        if (this.gameMode === 'two-player') {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updatePlayerIndicator();
        }
    }

    aiMove() {
        let move;

        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getHardMove();
                break;
            case 'impossible':
                move = this.getBestMove();
                break;
        }

        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }

    getRandomMove() {
        const emptyCells = this.board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
        return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
    }

    getMediumMove() {
        // Try to win or block
        for (let player of ['O', 'X']) {
            for (let condition of this.winningConditions) {
                const [a, b, c] = condition;
                const cells = [this.board[a], this.board[b], this.board[c]];

                if (cells.filter(cell => cell === player).length === 2 && cells.includes('')) {
                    return condition[cells.indexOf('')];
                }
            }
        }

        // Otherwise random
        return this.getRandomMove();
    }

    getHardMove() {
        // 70% chance to use smart move, 30% random
        return Math.random() < 0.7 ? this.getMediumMove() : this.getRandomMove();
    }

    getBestMove() {
        // Minimax algorithm for perfect play
        return this.minimax(this.board, 'O').index;
    }

    minimax(newBoard, player) {
        const availableSpots = newBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);

        // Check for terminal states
        if (this.checkWin(newBoard, 'X')) return { score: -10 };
        if (this.checkWin(newBoard, 'O')) return { score: 10 };
        if (availableSpots.length === 0) return { score: 0 };

        const moves = [];

        for (let i = 0; i < availableSpots.length; i++) {
            const move = {};
            move.index = availableSpots[i];

            newBoard[availableSpots[i]] = player;

            if (player === 'O') {
                const result = this.minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = this.minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    checkGameResult() {
        let gameWon = false;

        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                gameWon = true;
                this.handleWin(condition, this.board[a]);
                break;
            }
        }

        if (gameWon) return true;

        // Check for draw
        if (!this.board.includes('')) {
            this.handleDraw();
            return true;
        }

        return false;
    }

    handleWin(winningCombo, winner) {
        this.gameActive = false;
        this.drawWinningLine(winningCombo);

        // Play win sound
        this.playSound('win');

        // Update statistics
        if (winner === 'X') {
            this.stats.wins++;
            document.getElementById('gameStatus').textContent = 'You win! 🎉';
        } else {
            this.stats.losses++;
            document.getElementById('gameStatus').textContent = 'AI wins! 🤖';
        }

        this.updateStats();
        this.saveStats();
    }

    handleDraw() {
        this.gameActive = false;
        this.stats.draws++;
        document.getElementById('gameStatus').textContent = "It's a draw! 🤝";
        this.updateStats();
        this.saveStats();
        this.playSound('draw');
    }

    drawWinningLine(combo) {
        const winLine = document.getElementById('winLine');
        const boardRect = document.getElementById('gameBoard').getBoundingClientRect();

        const [a, b, c] = combo;
        const cellSize = boardRect.width / 3;

        // Calculate line coordinates based on winning combination
        let startX, startY, endX, endY;

        if (combo[0] === 0 && combo[2] === 2) { // Top row
            startX = cellSize * 0.1; startY = cellSize * 0.5;
            endX = cellSize * 2.9; endY = cellSize * 0.5;
        } else if (combo[0] === 3 && combo[2] === 5) { // Middle row
            startX = cellSize * 0.1; startY = cellSize * 1.5;
            endX = cellSize * 2.9; endY = cellSize * 1.5;
        } else if (combo[0] === 6 && combo[2] === 8) { // Bottom row
            startX = cellSize * 0.1; startY = cellSize * 2.5;
            endX = cellSize * 2.9; endY = cellSize * 2.5;
        } else if (combo[0] === 0 && combo[2] === 6) { // Left column
            startX = cellSize * 0.5; startY = cellSize * 0.1;
            endX = cellSize * 0.5; endY = cellSize * 2.9;
        } else if (combo[0] === 1 && combo[2] === 7) { // Middle column
            startX = cellSize * 1.5; startY = cellSize * 0.1;
            endX = cellSize * 1.5; endY = cellSize * 2.9;
        } else if (combo[0] === 2 && combo[2] === 8) { // Right column
            startX = cellSize * 2.5; startY = cellSize * 0.1;
            endX = cellSize * 2.5; endY = cellSize * 2.9;
        } else if (combo[0] === 0 && combo[2] === 8) { // Diagonal \
            startX = cellSize * 0.1; startY = cellSize * 0.1;
            endX = cellSize * 2.9; endY = cellSize * 2.9;
        } else if (combo[0] === 2 && combo[2] === 6) { // Diagonal /
            startX = cellSize * 2.9; startY = cellSize * 0.1;
            endX = cellSize * 0.1; endY = cellSize * 2.9;
        }

        winLine.style.width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + 'px';
        winLine.style.height = '8px';
        winLine.style.left = startX + 'px';
        winLine.style.top = startY + 'px';
        winLine.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;
        winLine.style.transformOrigin = '0 0';
        winLine.classList.add('show');

        // Add celebration animation to board
        document.getElementById('gameBoard').classList.add('win');
    }

    checkWin(board, player) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    renderBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.className = 'cell';
            if (this.board[index] === 'X') {
                cell.classList.add('x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        // Reset visual elements
        document.getElementById('winLine').classList.remove('show');
        document.getElementById('gameBoard').classList.remove('win');
        document.getElementById('gameStatus').textContent = this.gameMode === 'ai' ? 'Your turn!' : "Player X's turn";

        this.updatePlayerIndicator();
        this.renderBoard();
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.resetGame();
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    updatePlayerIndicator() {
        const indicator = document.querySelector('.player-indicator');
        indicator.innerHTML = this.currentPlayer === 'X' ?
            '<i class="fas fa-times player-x"></i><span>Player X</span>' :
            '<i class="fas fa-circle player-o"></i><span>Player O</span>';
    }

    updateDisplay() {
        document.getElementById('wins').textContent = this.stats.wins;
        document.getElementById('losses').textContent = this.stats.losses;
        document.getElementById('draws').textContent = this.stats.draws;
    }

    updateStats() {
        this.updateDisplay();
    }

    resetStats() {
        this.stats = { wins: 0, losses: 0, draws: 0 };
        this.updateStats();
        this.saveStats();
    }

    saveStats() {
        localStorage.setItem('ticTacToeWins', this.stats.wins);
        localStorage.setItem('ticTacToeLosses', this.stats.losses);
        localStorage.setItem('ticTacToeDraws', this.stats.draws);
    }

    playSound(type) {
        // Simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch (type) {
                case 'move':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    break;
                case 'win':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    break;
                case 'draw':
                    oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    break;
            }

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});