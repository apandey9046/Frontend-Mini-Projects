class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.calculatorElement = document.querySelector('.calculator');
        this.modeToggleBtn = document.getElementById('modeToggle');
        this.isLandscape = false;

        this.clear();
        this.setupEventListeners();
        this.setupModeToggle();
    }

    setupModeToggle() {
        this.modeToggleBtn.addEventListener('click', () => {
            this.toggleMode();
        });

        // Auto-detect screen size and adjust mode accordingly
        this.handleResize();
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    toggleMode() {
        // Only allow mode switching on desktop/laptop screens
        if (window.innerWidth >= 769) {
            this.isLandscape = !this.isLandscape;

            if (this.isLandscape) {
                this.calculatorElement.classList.remove('portrait');
                this.calculatorElement.classList.add('landscape');
                this.modeToggleBtn.innerHTML = '<i class="fas fa-rotate-left"></i><span>Basic Mode</span>';
            } else {
                this.calculatorElement.classList.remove('landscape');
                this.calculatorElement.classList.add('portrait');
                this.modeToggleBtn.innerHTML = '<i class="fas fa-rotate-right"></i><span>Scientific Mode</span>';
            }
        }
    }

    handleResize() {
        // Auto-switch to portrait mode on mobile devices
        if (window.innerWidth < 769) {
            this.isLandscape = false;
            this.calculatorElement.classList.remove('landscape');
            this.calculatorElement.classList.add('portrait');
            this.modeToggleBtn.innerHTML = '<i class="fas fa-rotate-right"></i><span>Scientific Mode</span>';
        }
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperator(operator) {
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    performScientificFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) && func !== 'π' && func !== 'e' && func !== '(' && func !== ')') return;

        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'sinh':
                result = Math.sinh(current);
                break;
            case 'cosh':
                result = Math.cosh(current);
                break;
            case 'tanh':
                result = Math.tanh(current);
                break;
            case 'log':
                if (current <= 0) {
                    alert('Logarithm is undefined for non-positive numbers!');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Natural logarithm is undefined for non-positive numbers!');
                    return;
                }
                result = Math.log(current);
                break;
            case '√':
                if (current < 0) {
                    alert('Square root is undefined for negative numbers!');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case 'x^y':
                this.operation = '^';
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
                return;
            case '10^x':
                result = Math.pow(10, current);
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case '1/x':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                result = 1 / current;
                break;
            case '|x|':
                result = Math.abs(current);
                break;
            case '!':
                if (current < 0 || !Number.isInteger(current)) {
                    alert('Factorial is only defined for non-negative integers!');
                    return;
                }
                result = this.factorial(current);
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case '(':
                this.appendNumber('(');
                this.updateDisplay();
                return;
            case ')':
                this.appendNumber(')');
                this.updateDisplay();
                return;
            case '%':
                result = current / 100;
                break;
            default:
                return;
        }

        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    getDisplayNumber(number) {
        if (number === '') return '';

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn-number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.updateDisplay();
            });
        });

        // Operator buttons
        document.querySelectorAll('.btn-operator').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperator(button.getAttribute('data-operator'));
                this.updateDisplay();
            });
        });

        // Function buttons
        document.querySelector('.btn[data-action="clear"]').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });

        document.querySelector('.btn[data-action="backspace"]').addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });

        document.querySelector('.btn[data-action="calculate"]').addEventListener('click', () => {
            this.calculate();
            this.updateDisplay();
        });

        document.querySelector('.btn[data-action="percentage"]').addEventListener('click', () => {
            this.performScientificFunction('%');
        });

        // Scientific buttons
        document.querySelectorAll('.btn-scientific').forEach(button => {
            button.addEventListener('click', () => {
                this.performScientificFunction(button.getAttribute('data-scientific'));
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                this.appendNumber(event.key);
                this.updateDisplay();
            } else if (event.key === '.') {
                this.appendNumber('.');
                this.updateDisplay();
            } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                let operator;
                switch (event.key) {
                    case '+': operator = '+'; break;
                    case '-': operator = '-'; break;
                    case '*': operator = '×'; break;
                    case '/': operator = '÷'; break;
                }
                this.chooseOperator(operator);
                this.updateDisplay();
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.calculate();
                this.updateDisplay();
            } else if (event.key === 'Escape' || event.key === 'Delete') {
                this.clear();
                this.updateDisplay();
            } else if (event.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            } else if (event.key === '%') {
                this.performScientificFunction('%');
            } else if (event.key === '(') {
                this.appendNumber('(');
                this.updateDisplay();
            } else if (event.key === ')') {
                this.appendNumber(')');
                this.updateDisplay();
            }
        });
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});