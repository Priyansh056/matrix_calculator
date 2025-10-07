document.addEventListener('DOMContentLoaded', () => {
    const mainDisplay = document.getElementById('main-display');
    const equationDisplay = document.getElementById('equation-display');
    const radDegToggle = document.getElementById('rad-deg-toggle');

    let displayValue = '0';
    let equationValue = '';
    let isRadians = true;

    function updateDisplay() {
        mainDisplay.textContent = displayValue;
        equationDisplay.textContent = equationValue;
    }

    function handleNumber(num) {
        if (displayValue === '0' || displayValue === 'Error') {
            displayValue = num;
        } else {
            displayValue += num;
        }
        updateDisplay();
    }

    function handleOperator(op) {
        if (displayValue === 'Error') return;
        // Replace math symbols for display
        const displayOp = op.replace('*', '×').replace('/', '÷');
        equationValue = displayValue + ' ' + displayOp + ' ';
        displayValue = '0';
        updateDisplay();
    }

    function handleFunction(func) {
        if (displayValue === 'Error') return;
        try {
            const num = parseFloat(displayValue);
            let result;

            switch (func) {
                case 'sin':
                    result = isRadians ? Math.sin(num) : Math.sin(num * Math.PI / 180);
                    break;
                case 'cos':
                    result = isRadians ? Math.cos(num) : Math.cos(num * Math.PI / 180);
                    break;
                case 'tan':
                    result = isRadians ? Math.tan(num) : Math.tan(num * Math.PI / 180);
                    break;
                case 'log':
                    result = Math.log10(num);
                    break;
                case 'ln':
                    result = Math.log(num);
                    break;
                case 'sqrt':
                    result = Math.sqrt(num);
                    break;
                case 'x^2':
                    result = num * num;
                    break;
                case 'x^y':
                    equationValue = displayValue + ' ^ ';
                    displayValue = '0';
                    updateDisplay();
                    return;
                case '1/x':
                    result = 1 / num;
                    break;
                case 'abs':
                    result = Math.abs(num);
                    break;
                case 'π':
                    displayValue = Math.PI.toString();
                    updateDisplay();
                    return;
                case 'e':
                    displayValue = Math.E.toString();
                    updateDisplay();
                    return;
                default:
                    return;
            }

            displayValue = result.toString();
            equationValue = '';
        } catch (e) {
            displayValue = 'Error';
        }
        updateDisplay();
    }

    function calculate() {
        if (displayValue === 'Error') return;
        try {
            const fullExpression = (equationValue + displayValue)
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace('^', '**')
                .replace(/−/g, '-'); // Ensure minus sign is correct

            // Note: eval() is used for simplicity, but it's a security risk in real applications.
            const result = eval(fullExpression);
            displayValue = result.toString();
            equationValue = '';
        } catch (e) {
            displayValue = 'Error';
            equationValue = '';
        }
        updateDisplay();
    }

    function clear() {
        displayValue = '0';
        equationValue = '';
        updateDisplay();
    }

    function backspace() {
        if (displayValue === 'Error') {
            clear();
            return;
        }
        if (displayValue.length === 1) {
            displayValue = '0';
        } else {
            displayValue = displayValue.slice(0, -1);
        }
        updateDisplay();
    }
    
    function toggleSign() {
        if (displayValue === 'Error') return;
        if (displayValue.startsWith('-')) {
            displayValue = displayValue.slice(1);
        } else if (displayValue !== '0') {
            displayValue = '-' + displayValue;
        }
        updateDisplay();
    }

    // Event Listeners
    document.querySelector('.buttons-grid').addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('.btn')) return;

        const value = target.dataset.value;
        const action = target.dataset.action;

        if (value) {
            if (target.classList.contains('number')) {
                handleNumber(value);
            } else if (target.classList.contains('operator')) {
                handleOperator(value);
            } else if (target.classList.contains('function')) {
                handleFunction(value);
            }
        } else if (action) {
            switch (action) {
                case 'calculate':
                    calculate();
                    break;
                case 'clear':
                    clear();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'toggle-sign':
                    toggleSign();
                    break;
            }
        }
    });

    radDegToggle.addEventListener('click', () => {
        isRadians = !isRadians;
        radDegToggle.textContent = isRadians ? 'RAD' : 'DEG';
    });
});
