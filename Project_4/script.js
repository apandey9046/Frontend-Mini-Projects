class Chatbot {
    constructor() {
        this.soundEnabled = true;
        this.chatHistory = [];
        this.lastKeyPressTime = 0;
        this.keyPressCooldown = 100; // ms between key sounds
        
        this.initializeElements();
        this.setupEventListeners();
        this.startClock();
        this.setupAudio();
    }

    initializeElements() {
        // Chat elements
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Time display elements
        this.currentTime = document.getElementById('currentTime');
        this.currentDate = document.getElementById('currentDate');
        
        // Sound toggle
        this.soundToggle = document.getElementById('soundToggle');
        
        // Audio elements
        this.keySound = document.getElementById('keySound');
        this.sendSound = document.getElementById('sendSound');
        this.receiveSound = document.getElementById('receiveSound');
    }

    setupEventListeners() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Keyboard sound effects - improved
        this.chatInput.addEventListener('input', (e) => {
            this.playKeySound();
        });
        
        this.chatInput.addEventListener('keydown', (e) => {
            // Play sound for special keys (backspace, enter, etc.)
            if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
                this.playKeySound();
            }
        });
        
        // Sound toggle
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.closest('.suggestion-btn').dataset.message;
                this.chatInput.value = message;
                this.sendMessage();
            });
        });

        // Enable touch scrolling for mobile
        this.chatMessages.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.chatMessages.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    setupAudio() {
        // Create realistic keyboard sounds using Web Audio API
        this.createKeyboardSound(this.keySound);
        this.createSendSound(this.sendSound);
        this.createReceiveSound(this.receiveSound);
    }

    createKeyboardSound(audioElement) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Random frequency between 100-300 Hz for variety
        const frequency = 100 + Math.random() * 200;
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    createSendSound(audioElement) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    createReceiveSound(audioElement) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    }

    playKeySound() {
        const now = Date.now();
        if (now - this.lastKeyPressTime < this.keyPressCooldown) return;
        
        this.lastKeyPressTime = now;
        
        if (this.soundEnabled) {
            // Create a new sound instance for each keypress
            this.createKeyboardSound(this.keySound);
        }
    }

    playSendSound() {
        if (this.soundEnabled) {
            this.createSendSound(this.sendSound);
        }
    }

    playReceiveSound() {
        if (this.soundEnabled) {
            this.createReceiveSound(this.receiveSound);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.classList.toggle('muted', !this.soundEnabled);
        
        if (this.soundEnabled) {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.soundToggle.title = 'Disable sounds';
        } else {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.soundToggle.title = 'Enable sounds';
        }
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        
        // Format time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        };
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        
        // Format date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('en-US', dateOptions);
        
        this.currentTime.textContent = timeString;
        this.currentDate.textContent = dateString;
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.playSendSound();
        
        // Clear input
        this.chatInput.value = '';
        
        // Simulate AI thinking delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            this.playReceiveSound();
        }, 1000 + Math.random() * 1000);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatarIcon = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHTML(text)}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to chat history
        this.chatHistory.push({
            sender: sender,
            text: text,
            timestamp: now
        });
    }

    scrollToBottom() {
        // Smooth scroll to bottom
        this.chatMessages.scrollTo({
            top: this.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Touch scrolling for mobile devices
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.scrollStartTop = this.chatMessages.scrollTop;
    }

    handleTouchMove(e) {
        if (!this.touchStartY) return;
        
        const touchY = e.touches[0].clientY;
        const diff = this.touchStartY - touchY;
        this.chatMessages.scrollTop = this.scrollStartTop + diff;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Time-related queries
        if (message.includes('time') || message.includes('what time')) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            });
            return `The current time is ${timeString}.`;
        }
        
        // Date-related queries
        if (message.includes('date') || message.includes('today') || message.includes('what date')) {
            const now = new Date();
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            return `Today is ${dateString}.`;
        }
        
        // Weather-related queries
        if (message.includes('weather') || message.includes('temperature')) {
            const weatherResponses = [
                "It's a beautiful day outside! Perfect weather for going out.",
                "The weather seems nice today, though I don't have real-time weather data.",
                "I'd check a weather service for accurate forecasts, but it looks pleasant!",
                "Weather conditions appear favorable today for outdoor activities."
            ];
            return weatherResponses[Math.floor(Math.random() * weatherResponses.length)];
        }
        
        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            const greetings = [
                "Hello! How can I assist you today?",
                "Hi there! What can I help you with?",
                "Hey! Nice to meet you. How can I be of service?",
                "Hello! I'm here to help. What would you like to know?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // How are you
        if (message.includes('how are you') || message.includes('how do you do')) {
            return "I'm functioning perfectly! Thanks for asking. How can I help you today?";
        }
        
        // Name queries
        if (message.includes('your name') || message.includes('who are you')) {
            return "I'm an AI assistant created to help with your queries. You can call me ChatBot!";
        }
        
        // Help queries
        if (message.includes('help') || message.includes('what can you do')) {
            return "I can tell you the current time and date, discuss weather, answer questions, and have friendly conversations. Try asking me anything!";
        }
        
        // Thank you responses
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Goodbye
        if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
            return "Goodbye! Feel free to come back if you need any help. Have a great day!";
        }
        
        // Default responses for unknown queries
        const defaultResponses = [
            "That's interesting! Can you tell me more?",
            "I understand. What else would you like to know?",
            "Thanks for sharing that with me. Is there anything specific you'd like to ask?",
            "I see. How can I assist you further?",
            "That's a great point! Did you have any questions about time, date, or weather?",
            "Interesting! I'm here to help with any information you need.",
            "I appreciate you sharing that. What can I help you with today?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// Initialize the chatbot when the DOM is loaded
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new Chatbot();
});