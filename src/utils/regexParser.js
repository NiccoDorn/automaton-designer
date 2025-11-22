// Regex Parser for converting regular expressions to NFA
// Supported: *, +, ?, |, (), concatenation, {n}, {n,m}, etc.

export function validateRegex(regex) {
    const errors = [];

    // Check for balanced parentheses
    let parenCount = 0;
    for (let i = 0; i < regex.length; i++) {
        if (regex[i] === '(') parenCount++;
        if (regex[i] === ')') parenCount--;
        if (parenCount < 0) {
            errors.push('Unmatched closing parenthesis');
            break;
        }
    }
    if (parenCount > 0) {
        errors.push('Unmatched opening parenthesis');
    }

    // Check for invalid characters after quantifiers
    const quantifiers = ['*', '+', '?'];
    for (let i = 0; i < regex.length - 1; i++) {
        if (quantifiers.includes(regex[i]) && quantifiers.includes(regex[i + 1])) {
            errors.push(`Invalid sequence: ${regex[i]}${regex[i + 1]}`);
        }
    }

    // Check for empty alternation
    if (regex.includes('||')) {
        errors.push('Empty alternation detected');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function parseRegex(regex) {
    // Tokenize the regex
    const tokens = tokenize(regex);
    // Convert to postfix notation (RPN) for easier processing
    const postfix = toPostfix(tokens);
    return postfix;
}

function tokenize(regex) {
    const tokens = [];
    let i = 0;

    while (i < regex.length) {
        const char = regex[i];

        if (char === '(') {
            tokens.push({ type: 'LPAREN', value: '(' });
            i++;
        } else if (char === ')') {
            tokens.push({ type: 'RPAREN', value: ')' });
            i++;
        } else if (char === '|') {
            tokens.push({ type: 'OR', value: '|' });
            i++;
        } else if (char === '*') {
            tokens.push({ type: 'STAR', value: '*' });
            i++;
        } else if (char === '+') {
            tokens.push({ type: 'PLUS', value: '+' });
            i++;
        } else if (char === '?') {
            tokens.push({ type: 'QUESTION', value: '?' });
            i++;
        } else if (char === '{') {
            // Parse quantifier {n}, {n,m}, etc.
            const quantifier = parseQuantifier(regex, i);
            tokens.push(quantifier.token);
            i = quantifier.nextIndex;
        } else if (char === '\\') {
            // Escaped character
            if (i + 1 < regex.length) {
                tokens.push({ type: 'CHAR', value: regex[i + 1] });
                i += 2;
            } else {
                i++;
            }
        } else {
            // Regular character
            tokens.push({ type: 'CHAR', value: char });
            i++;
        }
    }

    return tokens;
}

function parseQuantifier(regex, startIndex) {
    let i = startIndex + 1;
    let quantStr = '';

    while (i < regex.length && regex[i] !== '}') {
        quantStr += regex[i];
        i++;
    }

    const parts = quantStr.split(',');
    if (parts.length === 1) {
        return {
            token: { type: 'QUANT', value: { min: parseInt(parts[0]), max: parseInt(parts[0]) } },
            nextIndex: i + 1
        };
    } else {
        const min = parts[0] ? parseInt(parts[0]) : 0;
        const max = parts[1] ? parseInt(parts[1]) : Infinity;
        return {
            token: { type: 'QUANT', value: { min, max } },
            nextIndex: i + 1
        };
    }
}

function toPostfix(tokens) {
    // Insert explicit concatenation operators
    const withConcat = insertConcatOperators(tokens);

    // Shunting-yard algorithm
    const output = [];
    const operators = [];
    const precedence = {
        'OR': 1,
        'CONCAT': 2,
        'STAR': 3,
        'PLUS': 3,
        'QUESTION': 3,
        'QUANT': 3
    };

    for (const token of withConcat) {
        if (token.type === 'CHAR') {
            output.push(token);
        } else if (token.type === 'LPAREN') {
            operators.push(token);
        } else if (token.type === 'RPAREN') {
            while (operators.length > 0 && operators[operators.length - 1].type !== 'LPAREN') {
                output.push(operators.pop());
            }
            operators.pop(); // Remove LPAREN
        } else {
            // Operator
            while (
                operators.length > 0 &&
                operators[operators.length - 1].type !== 'LPAREN' &&
                precedence[operators[operators.length - 1].type] >= precedence[token.type]
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}

function insertConcatOperators(tokens) {
    const result = [];

    for (let i = 0; i < tokens.length; i++) {
        result.push(tokens[i]);

        if (i < tokens.length - 1) {
            const curr = tokens[i];
            const next = tokens[i + 1];

            // Insert CONCAT between:
            // - CHAR and CHAR
            // - CHAR and LPAREN
            // - RPAREN and CHAR
            // - RPAREN and LPAREN
            // - Quantifier and CHAR
            // - Quantifier and LPAREN
            const needsConcat = (
                (curr.type === 'CHAR' && (next.type === 'CHAR' || next.type === 'LPAREN')) ||
                (curr.type === 'RPAREN' && (next.type === 'CHAR' || next.type === 'LPAREN')) ||
                (['STAR', 'PLUS', 'QUESTION', 'QUANT'].includes(curr.type) &&
                 (next.type === 'CHAR' || next.type === 'LPAREN'))
            );

            if (needsConcat) {
                result.push({ type: 'CONCAT', value: '·' });
            }
        }
    }

    return result;
}
