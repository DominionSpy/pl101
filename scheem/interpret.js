var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        if (!env[expr]) throw new Error("Cannot reference an undefined variable");
        return env[expr];
    }
    if (expr === 'error') throw('Error');
    // Look at head of list for operation
    switch (expr[0]) {
        case 'quote':
            if (expr.length != 2) throw new Error("Unexpected number of arguments");
            return expr[1];
        case 'define':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            if (typeof expr[1] !== 'string') throw new Error("Expecting variable name");
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'set!':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            if (typeof expr[1] !== 'string') throw new Error("Expecting variable name");
            if (!env[expr[1]]) throw new Error("Cannot set an undefined variable");
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'begin':
            if (expr.length < 2) throw new Error("Unexpected number of arguments");
            var retval;
            for (var i = 1; i < expr.length; i++)
            {
                retval = evalScheem(expr[i], env);
            }
            return retval;
        case '+':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            if (typeof arg1 !== 'number' || typeof arg2 !== 'number') throw new Error("Arguments must evaluate to numbers");
            return arg1 + arg2;
        case '-':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            if (typeof arg1 !== 'number' || typeof arg2 !== 'number') throw new Error("Arguments must evaluate to numbers");
            return arg1 - arg2;
        case '*':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            if (typeof arg1 !== 'number' || typeof arg2 !== 'number') throw new Error("Arguments must evaluate to numbers");
            return arg1 * arg2;
        case '/':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            if (typeof arg1 !== 'number' || typeof arg2 !== 'number') throw new Error("Arguments must evaluate to numbers");
            return arg1 / arg2;
        case '=':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            var eq = arg1 === arg2;
            if (eq) return '#t';
            return '#f';
        case '<':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            var arg1 = evalScheem(expr[1], env);
            var arg2 = evalScheem(expr[2], env);
            if (typeof arg1 !== 'number' || typeof arg2 !== 'number') throw new Error("Arguments must evaluate to numbers");
            var lt = arg1 < arg2;
            if (lt) return '#t';
            return '#f';
        case 'cons':
            if (expr.length != 3) throw new Error("Unexpected number of arguments");
            return [evalScheem(expr[1], env)].concat(evalScheem(expr[2], env));
        case 'car':
            if (expr.length != 2) throw new Error("Unexpected number of arguments");
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            if (expr.length != 2) throw new Error("Unexpected number of arguments");
            return evalScheem(expr[1], env).slice(1);
        case 'if':
            if (expr.length != 4) throw new Error("Unexpected number of arguments");
            var cond = evalScheem(expr[1], env)
            if  (cond === '#t') return evalScheem(expr[2], env);
            else if (cond === '#f') return evalScheem(expr[3], env);
            throw new Error("Condition must resolve to true or false");
    }
};