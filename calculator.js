// Calculator Class
class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.lastResult = null;
        this.isNewCalculation = true;
    }

    // Clear all data
    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.lastResult = null;
        this.isNewCalculation = true;
        this.updateDisplay();
        this.clearDisplayStates();
    }

    // Clear display states
    clearDisplayStates() {
        const display = document.querySelector('.display');
        display.classList.remove('error', 'success', 'typing');
    }

    // Delete last digit
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    // Append number to current operand
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.shouldResetScreen || this.isNewCalculation) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
            this.isNewCalculation = false;
        }
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
        this.showTypingState();
    }

    // Choose operation
    chooseOperation(operation) {
        if (this.currentOperand === '') {
            if (this.previousOperand !== '') {
                this.operation = operation;
                this.updateDisplay();
                this.updateActiveOperator();
            }
            return;
        }
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = true;
        this.isNewCalculation = false;
        
        this.updateDisplay();
        this.updateActiveOperator();
        this.clearDisplayStates();
    }

    // Compute the result with real-time updates
    compute() {
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
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.lastResult = computation;
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.isNewCalculation = true;
        
        this.updateDisplay();
        this.showSuccessState();
        this.updateActiveOperator();
    }

    // Calculate percentage
    calculatePercent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        const result = current / 100;
        this.currentOperand = result.toString();
        this.lastResult = result;
        this.shouldResetScreen = true;
        this.isNewCalculation = true;
        
        this.updateDisplay();
        this.showSuccessState();
    }

    // Format display number with enhanced formatting
    getDisplayNumber(number) {
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
            // Limit decimal places for better display
            const limitedDecimal = decimalDigits.slice(0, 8);
            return `${integerDisplay}.${limitedDecimal}`;
        } else {
            return integerDisplay;
        }
    }

    // Update display with enhanced formatting
    updateDisplay() {
        const currentOperandElement = document.getElementById('currentOperand');
        const previousOperandElement = document.getElementById('previousOperand');
        
        // Format current operand
        const displayNumber = this.getDisplayNumber(this.currentOperand);
        currentOperandElement.innerText = displayNumber;
        
        // Responsive font-size logic
        let baseFontSize = 2.8; // rem, matches CSS
        let minFontSize = 1.2; // rem, minimum font size
        let length = displayNumber.replace(/[^\d]/g, '').length; // count digits only
        let fontSize = baseFontSize;
        if (length > 8) {
            fontSize = Math.max(baseFontSize - (length - 8) * 0.18, minFontSize);
        }
        currentOperandElement.style.fontSize = fontSize + 'rem';
        
        // Format previous operand with operation
        if (this.operation != null) {
            const prevNumber = this.getDisplayNumber(this.previousOperand);
            previousOperandElement.innerText = `${prevNumber} ${this.operation}`;
        } else {
            previousOperandElement.innerText = '';
        }
        
        // Add typing animation class
        if (!this.shouldResetScreen && !this.isNewCalculation) {
            currentOperandElement.classList.add('typing');
        } else {
            currentOperandElement.classList.remove('typing');
        }
    }

    // Show error message with enhanced styling
    showError(message) {
        const display = document.querySelector('.display');
        const currentOperandElement = document.getElementById('currentOperand');
        
        display.classList.add('error');
        currentOperandElement.innerText = message;
        
        // Add shake animation
        display.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            display.classList.remove('error');
            display.style.animation = '';
            this.clear();
        }, 2000);
    }

    // Show success state
    showSuccess() {
        const display = document.querySelector('.display');
        display.classList.add('success');
        
        setTimeout(() => {
            display.classList.remove('success');
        }, 1000);
    }

    // Show typing state
    showTypingState() {
        const display = document.querySelector('.display');
        display.classList.add('typing');
        
        setTimeout(() => {
            display.classList.remove('typing');
        }, 300);
    }

    // Handle keyboard input with enhanced support
    handleKeyboardInput(key) {
        // Number keys (0-9)
        if (key >= '0' && key <= '9') {
            this.appendNumber(key);
            return true;
        }
        
        // Decimal point
        if (key === '.') {
            this.appendNumber(key);
            return true;
        }
        
        // Operations
        if (key === '+' || key === '-') {
            this.chooseOperation(key);
            return true;
        }
        
        if (key === '*') {
            this.chooseOperation('×');
            return true;
        }
        
        if (key === '/') {
            this.chooseOperation('÷');
            return true;
        }
        
        // Equals
        if (key === 'Enter' || key === '=') {
            this.compute();
            this.showSuccess();
            return true;
        }
        
        // Delete
        if (key === 'Backspace') {
            this.delete();
            return true;
        }
        
        // Clear
        if (key === 'Escape') {
            this.clear();
            return true;
        }
        
        // Percentage
        if (key === '%') {
            this.calculatePercent();
            return true;
        }
        
        return false;
    }

    // Get last result for chaining operations
    getLastResult() {
        return this.lastResult;
    }

    // Check if calculator is in a state to accept new input
    canAcceptInput() {
        return !this.shouldResetScreen || this.isNewCalculation;
    }
}

// Initialize calculator
const calculator = new Calculator();

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-action="percent"]');

// Enhanced Event Listeners with better feedback
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        calculator.appendNumber(number);
        
        // Add visual feedback
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 150);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        // Add visual feedback
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 150);
        
        switch (action) {
            case 'add':
                calculator.chooseOperation('+');
                break;
            case 'subtract':
                calculator.chooseOperation('-');
                break;
            case 'multiply':
                calculator.chooseOperation('×');
                break;
            case 'divide':
                calculator.chooseOperation('÷');
                break;
            case 'percent':
                calculator.calculatePercent();
                break;
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                calculator.showSuccess();
                break;
        }
        
        calculator.updateDisplay();
        updateActiveOperator();
    });
});

// Update active operator styling with enhanced visual feedback
function updateActiveOperator() {
    // Remove active class from all operators
    document.querySelectorAll('.btn.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current operator
    if (calculator.operation) {
        const operatorMap = {
            '+': 'add',
            '-': 'subtract',
            '×': 'multiply',
            '÷': 'divide'
        };
        
        const action = operatorMap[calculator.operation];
        if (action) {
            const activeButton = document.querySelector(`[data-action="${action}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
}

// Enhanced keyboard support with better handling
document.addEventListener('keydown', (e) => {
    // Prevent default for calculator keys
    if (['Enter', 'Escape', 'Backspace', '+', '-', '*', '/', '=', '%'].includes(e.key)) {
        e.preventDefault();
    }
    
    // Handle the key input
    const handled = calculator.handleKeyboardInput(e.key);
    
    if (handled) {
        // Add visual feedback for keyboard input
        const display = document.querySelector('.display');
        display.classList.add('keyboard-input');
        setTimeout(() => display.classList.remove('keyboard-input'), 100);
    }
});

// Enhanced button press animation
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
        button.classList.add('pressed');
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
        setTimeout(() => button.classList.remove('pressed'), 150);
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.classList.remove('pressed');
    });
});

// Enhanced touch support for mobile
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(0.95)';
        button.classList.add('pressed');
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(1)';
        setTimeout(() => button.classList.remove('pressed'), 150);
    });
});

// Initialize display
calculator.updateDisplay();

// Add some fun features
let clickCount = 0;
const calculatorContainer = document.querySelector('.calculator');

calculatorContainer.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 10) {
        calculatorContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            calculatorContainer.style.animation = '';
        }, 500);
        clickCount = 0;
    }
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style); 