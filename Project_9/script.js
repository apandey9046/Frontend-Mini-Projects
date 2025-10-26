// Flashcard App - Learning with Spaced Repetition

class FlashcardApp {
    constructor() {
        this.decks = {
            general: {
                name: "General Knowledge",
                cards: [
                    { id: 1, question: "What is the capital of France?", answer: "Paris", difficulty: "medium", nextReview: null },
                    { id: 2, question: "What is the largest planet in our solar system?", answer: "Jupiter", difficulty: "easy", nextReview: null },
                    { id: 3, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", difficulty: "medium", nextReview: null },
                    { id: 4, question: "What is the chemical symbol for gold?", answer: "Au", difficulty: "hard", nextReview: null },
                    { id: 5, question: "How many continents are there?", answer: "7", difficulty: "easy", nextReview: null },
                    { id: 6, question: "What is the smallest country in the world?", answer: "Vatican City", difficulty: "hard", nextReview: null },
                    { id: 7, question: "What year did World War II end?", answer: "1945", difficulty: "medium", nextReview: null },
                    { id: 8, question: "What is the longest river in the world?", answer: "Nile River", difficulty: "medium", nextReview: null },
                    { id: 9, question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", difficulty: "easy", nextReview: null },
                    { id: 10, question: "What is the square root of 64?", answer: "8", difficulty: "easy", nextReview: null }
                ]
            },
            programming: {
                name: "Programming",
                cards: [
                    { id: 1, question: "What does HTML stand for?", answer: "HyperText Markup Language", difficulty: "easy", nextReview: null },
                    { id: 2, question: "What is a closure in JavaScript?", answer: "A function that has access to variables in its outer scope", difficulty: "hard", nextReview: null },
                    { id: 3, question: "What is the difference between let and var in JavaScript?", answer: "let has block scope, var has function scope", difficulty: "medium", nextReview: null },
                    { id: 4, question: "What is React?", answer: "A JavaScript library for building user interfaces", difficulty: "medium", nextReview: null },
                    { id: 5, question: "What does CSS stand for?", answer: "Cascading Style Sheets", difficulty: "easy", nextReview: null }
                ]
            },
            languages: {
                name: "Languages",
                cards: [
                    { id: 1, question: "How do you say 'Hello' in Spanish?", answer: "Hola", difficulty: "easy", nextReview: null },
                    { id: 2, question: "What is the French word for 'Thank you'?", answer: "Merci", difficulty: "easy", nextReview: null },
                    { id: 3, question: "How do you say 'Goodbye' in German?", answer: "Auf Wiedersehen", difficulty: "medium", nextReview: null },
                    { id: 4, question: "What is 'Water' in Japanese?", answer: "Mizu", difficulty: "hard", nextReview: null }
                ]
            }
        };
        
        this.currentDeck = 'general';
        this.currentCardIndex = 0;
        this.streakDays = 7;
        
        this.initializeApp();
        this.setupEventListeners();
        this.updateUI();
    }
    
    initializeApp() {
        // Load data from localStorage if available
        this.loadFromLocalStorage();
        
        // Initialize next review dates for cards that don't have them
        this.initializeReviewDates();
    }
    
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('flashcardAppData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.decks = data.decks || this.decks;
            this.currentDeck = data.currentDeck || this.currentDeck;
            this.currentCardIndex = data.currentCardIndex || this.currentCardIndex;
            this.streakDays = data.streakDays || this.streakDays;
        }
    }
    
    saveToLocalStorage() {
        const data = {
            decks: this.decks,
            currentDeck: this.currentDeck,
            currentCardIndex: this.currentCardIndex,
            streakDays: this.streakDays
        };
        localStorage.setItem('flashcardAppData', JSON.stringify(data));
    }
    
    initializeReviewDates() {
        const today = new Date();
        for (const deckKey in this.decks) {
            this.decks[deckKey].cards.forEach(card => {
                if (!card.nextReview) {
                    // Set initial review date based on difficulty
                    const reviewDate = new Date(today);
                    if (card.difficulty === 'easy') {
                        reviewDate.setDate(reviewDate.getDate() + 3);
                    } else if (card.difficulty === 'medium') {
                        reviewDate.setDate(reviewDate.getDate() + 1);
                    } else {
                        reviewDate.setDate(reviewDate.getDate());
                    }
                    card.nextReview = reviewDate.toISOString();
                }
            });
        }
        this.saveToLocalStorage();
    }
    
    setupEventListeners() {
        // Deck selection
        document.querySelectorAll('.deck-card').forEach(deck => {
            if (!deck.classList.contains('add-deck')) {
                deck.addEventListener('click', () => {
                    this.selectDeck(deck.dataset.deck);
                });
            }
        });
        
        // Card navigation
        document.getElementById('prev-card').addEventListener('click', () => {
            this.previousCard();
        });
        
        document.getElementById('next-card').addEventListener('click', () => {
            this.nextCard();
        });
        
        // Card flipping
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });
        
        document.getElementById('flashcard').addEventListener('click', () => {
            this.flipCard();
        });
        
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rateCard(button.dataset.difficulty);
            });
        });
        
        // Add card button
        document.getElementById('add-card').addEventListener('click', () => {
            this.addNewCard();
        });
        
        // Reset progress button
        document.getElementById('reset-progress').addEventListener('click', () => {
            this.resetProgress();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    selectDeck(deckKey) {
        this.currentDeck = deckKey;
        this.currentCardIndex = 0;
        
        // Update active deck UI
        document.querySelectorAll('.deck-card').forEach(deck => {
            deck.classList.remove('active');
        });
        document.querySelector(`.deck-card[data-deck="${deckKey}"]`).classList.add('active');
        
        this.updateUI();
        this.saveToLocalStorage();
    }
    
    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }
    
    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            document.getElementById('flashcard').classList.remove('flipped');
            this.updateUI();
        }
    }
    
    nextCard() {
        const deck = this.decks[this.currentDeck];
        if (this.currentCardIndex < deck.cards.length - 1) {
            this.currentCardIndex++;
            document.getElementById('flashcard').classList.remove('flipped');
            this.updateUI();
        }
    }
    
    rateCard(difficulty) {
        const deck = this.decks[this.currentDeck];
        const card = deck.cards[this.currentCardIndex];
        
        // Update card difficulty
        card.difficulty = difficulty;
        
        // Calculate next review date based on spaced repetition
        const now = new Date();
        const nextReview = new Date(now);
        
        // Simple spaced repetition intervals
        if (difficulty === 'easy') {
            nextReview.setDate(nextReview.getDate() + 7);
        } else if (difficulty === 'medium') {
            nextReview.setDate(nextReview.getDate() + 3);
        } else {
            nextReview.setDate(nextReview.getDate() + 1);
        }
        
        card.nextReview = nextReview.toISOString();
        
        // Move to next card
        if (this.currentCardIndex < deck.cards.length - 1) {
            this.currentCardIndex++;
            document.getElementById('flashcard').classList.remove('flipped');
        } else {
            // If it's the last card, go back to the first
            this.currentCardIndex = 0;
            document.getElementById('flashcard').classList.remove('flipped');
        }
        
        this.updateUI();
        this.saveToLocalStorage();
    }
    
    addNewCard() {
        const question = prompt("Enter the question for the new flashcard:");
        if (!question) return;
        
        const answer = prompt("Enter the answer for the new flashcard:");
        if (!answer) return;
        
        const deck = this.decks[this.currentDeck];
        const newCard = {
            id: deck.cards.length + 1,
            question: question,
            answer: answer,
            difficulty: 'medium',
            nextReview: new Date().toISOString()
        };
        
        deck.cards.push(newCard);
        this.currentCardIndex = deck.cards.length - 1;
        document.getElementById('flashcard').classList.remove('flipped');
        
        this.updateUI();
        this.saveToLocalStorage();
        
        // Show success message
        alert("New flashcard added successfully!");
    }
    
    resetProgress() {
        if (confirm("Are you sure you want to reset all progress? This will reset all card difficulties and review dates.")) {
            for (const deckKey in this.decks) {
                this.decks[deckKey].cards.forEach(card => {
                    card.difficulty = 'medium';
                    card.nextReview = new Date().toISOString();
                });
            }
            
            this.currentCardIndex = 0;
            document.getElementById('flashcard').classList.remove('flipped');
            this.updateUI();
            this.saveToLocalStorage();
            
            alert("Progress reset successfully!");
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Prevent default behavior for our shortcuts
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                this.flipCard();
                break;
            case '1':
                e.preventDefault();
                this.rateCard('easy');
                break;
            case '2':
                e.preventDefault();
                this.rateCard('medium');
                break;
            case '3':
                e.preventDefault();
                this.rateCard('hard');
                break;
        }
    }
    
    updateUI() {
        const deck = this.decks[this.currentDeck];
        const card = deck.cards[this.currentCardIndex];
        
        // Update card content
        document.getElementById('card-question').textContent = card.question;
        document.getElementById('card-answer').textContent = card.answer;
        
        // Update card counter
        document.getElementById('card-count').textContent = `${this.currentCardIndex + 1}/${deck.cards.length}`;
        
        // Update progress bar
        const progressPercentage = ((this.currentCardIndex + 1) / deck.cards.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercentage}%`;
        
        // Update stats
        this.updateStats();
        
        // Update navigation buttons state
        document.getElementById('prev-card').disabled = this.currentCardIndex === 0;
        document.getElementById('next-card').disabled = this.currentCardIndex === deck.cards.length - 1;
    }
    
    updateStats() {
        const deck = this.decks[this.currentDeck];
        
        // Calculate stats
        const totalCards = deck.cards.length;
        const masteredCards = deck.cards.filter(card => card.difficulty === 'easy').length;
        const reviewCards = deck.cards.filter(card => {
            const nextReview = new Date(card.nextReview);
            const today = new Date();
            return nextReview <= today;
        }).length;
        
        // Update stat values
        document.getElementById('total-cards').textContent = totalCards;
        document.getElementById('mastered-cards').textContent = masteredCards;
        document.getElementById('review-cards').textContent = reviewCards;
        document.getElementById('streak-days').textContent = this.streakDays;
        
        // Calculate next review time
        const nextReviewCard = deck.cards.reduce((earliest, card) => {
            const cardDate = new Date(card.nextReview);
            if (!earliest || cardDate < earliest) {
                return cardDate;
            }
            return earliest;
        }, null);
        
        if (nextReviewCard) {
            const now = new Date();
            const timeDiff = nextReviewCard - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 0) {
                document.getElementById('next-review-time').textContent = "Now";
            } else if (daysDiff === 1) {
                document.getElementById('next-review-time').textContent = "Tomorrow";
            } else {
                document.getElementById('next-review-time').textContent = `In ${daysDiff} days`;
            }
        } else {
            document.getElementById('next-review-time').textContent = "No reviews scheduled";
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});