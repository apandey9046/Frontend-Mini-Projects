// Snake Game JavaScript
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        // Game state
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameSpeed = 150; // Normal speed

        // Initialize game
        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.updateDisplay();
        this.showStartScreen();
    }

    setupCanvas() {
        // Ensure canvas is properly sized
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.tileCount = this.canvas.width / this.gridSize;
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Game control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(parseInt(e.target.dataset.speed));
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Mobile control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                this.handleDirectionChange(direction);
            });
        });
    }

    startGame() {
        this.resetGameState();
        this.gameRunning = true;
        this.gamePaused = false;
        this.hideScreens();
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        this.updateControls();
    }

    resetGame() {
        this.resetGameState();
        if (this.gameRunning) {
            this.startGame();
        } else {
            this.showStartScreen();
        }
    }

    resetGameState() {
        // Reset snake
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        // Reset direction
        this.direction = 'right';
        this.nextDirection = 'right';

        // Reset score
        this.score = 0;

        // Create first food
        this.createFood();

        this.updateDisplay();
    }

    togglePause() {
        if (!this.gameRunning) return;

        this.gamePaused = !this.gamePaused;
        if (this.gamePaused) {
            clearInterval(this.gameLoop);
        } else {
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        }
        this.updateControls();
    }

    setDifficulty(speed) {
        this.gameSpeed = speed;
        const speedNames = {
            150: 'Easy',
            100: 'Normal',
            70: 'Hard',
            40: 'Expert'
        };
        document.getElementById('speedLevel').textContent = speedNames[speed] || 'Normal';

        // Restart game if running
        if (this.gameRunning && !this.gamePaused) {
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.handleDirectionChange('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.handleDirectionChange('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.handleDirectionChange('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.handleDirectionChange('right');
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }

    handleDirectionChange(newDirection) {
        // Prevent 180-degree turns
        if (
            (newDirection === 'up' && this.direction !== 'down') ||
            (newDirection === 'down' && this.direction !== 'up') ||
            (newDirection === 'left' && this.direction !== 'right') ||
            (newDirection === 'right' && this.direction !== 'left')
        ) {
            this.nextDirection = newDirection;
        }
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return;

        this.direction = this.nextDirection;
        this.moveSnake();
        this.checkCollision();
        this.draw();
    }

    moveSnake() {
        // Create new head based on direction
        const head = { x: this.snake[0].x, y: this.snake[0].y };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if snake ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFood();
            this.updateDisplay();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    checkCollision() {
        const head = this.snake[0];

        // Wall collision
        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= this.tileCount ||
            head.y >= this.tileCount
        ) {
            this.gameOver();
            return;
        }

        // Self collision (skip first segment)
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
    }

    createFood() {
        let newFood;
        let onSnake;

        do {
            onSnake = false;
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };

            // Check if food appears on snake
            for (let segment of this.snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);

        this.food = newFood;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1f2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid();

        // Draw snake
        this.drawSnake();

        // Draw food
        this.drawFood();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#2d3748';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < this.tileCount; i++) {
            for (let j = 0; j < this.tileCount; j++) {
                this.ctx.strokeRect(
                    i * this.gridSize,
                    j * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
            }
        }
    }

    drawSnake() {
        // Draw snake body
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];

            // Gradient color from head to tail
            const colorValue = Math.max(100, 255 - (i * 10));
            this.ctx.fillStyle = i === 0 ? '#4f46e5' : `rgb(79, 70, ${colorValue})`;

            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );

            // Add rounded corners for head
            if (i === 0) {
                this.ctx.fillStyle = '#6366f1';
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * this.gridSize + this.gridSize / 2,
                    segment.y * this.gridSize + this.gridSize / 2,
                    this.gridSize / 3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
    }

    drawFood() {
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Add shine effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 3,
            this.food.y * this.gridSize + this.gridSize / 3,
            this.gridSize / 6,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }

        this.showGameOver();
        this.updateDisplay();
        this.updateControls();
    }

    showStartScreen() {
        document.getElementById('gameStart').classList.remove('hidden');
    }

    showGameOver() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }

    hideScreens() {
        document.getElementById('gameStart').classList.add('hidden');
        document.getElementById('gameOver').classList.add('hidden');
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }

    updateControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (this.gameRunning) {
            startBtn.style.display = 'none';
            pauseBtn.disabled = false;
            pauseBtn.innerHTML = this.gamePaused ?
                '<i class="fas fa-play"></i> Resume' :
                '<i class="fas fa-pause"></i> Pause';
        } else {
            startBtn.style.display = 'inline-flex';
            pauseBtn.disabled = true;
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});