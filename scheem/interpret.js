var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    if (expr === 'error') throw('Error');
    // Look at head of list for operation
    switch (expr[0]) {
        case 'quote':
            return expr[1];
        case 'define':
        case 'set!':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'begin':
            var retval;
            for (var i = 1; i < expr.length; i++)
            {
                retval = evalScheem(expr[i], env);
            }
            return retval;
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env);
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f';
        case '<':
            var lt =
                (evalScheem(expr[1], env) <
                 evalScheem(expr[2], env));
            if (lt) return '#t';
            return '#f';
        case 'cons':
            return [evalScheem(expr[1], env)].concat(evalScheem(expr[2], env));
        case 'car':
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            return evalScheem(expr[1], env).slice(1);
        case 'if':
            if (evalScheem(expr[1], env) === '#t')
            {
                return evalScheem(expr[2], env);
            }
            return evalScheem(expr[3], env);
    }
};