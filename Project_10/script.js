// Simple Word Counter

class WordCounter {
    constructor() {
        this.textInput = document.getElementById('text-input');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');
        this.clearBtn = document.getElementById('clear-btn');
        
        this.initializeApp();
    }
    
    initializeApp() {
        // Set up event listeners
        this.textInput.addEventListener('input', () => {
            this.updateCounts();
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearText();
        });
        
        // Initial count update
        this.updateCounts();
    }
    
    updateCounts() {
        const text = this.textInput.value;
        
        // Character count (including spaces)
        const charCount = text.length;
        
        // Word count (split by whitespace and filter empty strings)
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        // Update display
        this.charCount.textContent = charCount.toLocaleString();
        this.wordCount.textContent = wordCount.toLocaleString();
    }
    
    clearText() {
        if (this.textInput.value.trim() !== '') {
            if (confirm('Are you sure you want to clear the text?')) {
                this.textInput.value = '';
                this.updateCounts();
            }
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordCounter();
});