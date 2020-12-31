const utilities = {
    abs: (n) => {
        if (n < 0)
            return (-n)
        return n
    },
    // I user here the newton's method (also i can use ** operator)
    // https://pages.mtu.edu/~shene/COURSES/cs201/NOTES/chap06/sqrt-1.html#:~:text=Newton's%20method%20suggests%20that%20a,the%20square%20root%20of%20b.
    sqrt: (x) => {
        if (x == 0 || x == 1) return x;
        let absX = utilities.abs(x)
        let NewX
        const tolerance = 0.00001
        while (true) {
            NewX = 0.5 * (x + (absX / x));
            if (utilities.abs(x - NewX) < tolerance) break;
            x = NewX;
        }
        return NewX;
    },
    checkSyntax: (equation) => {
        let checker = new RegExp(/^((?:\-?\d+(?:\.\d+)?(?:\s+)\*(?:\s+)X\^\d+)(?:(?:\s+)\+(?:\s+)|(?:\s+)\-(?:\s+))?)+(?:\s+)=(?:\s+)((?:[+-]?\d+(?:\.\d+)?(?:\s+)\*(?:\s+)X\^\d+)(?:(?:\s+)\+(?:\s+)|(?:\s+)\-(?:\s+))?)+$/g);
        if (!checker.test(equation)) return false
        return true
    },
    storeSide: (side) => {
        var storedSide = []
        let isExponent = false
        let isNegative = false;
        let newSet = { base: null, exponent: null }
        side.forEach(elm => {
            if (elm === '-') isNegative = true
            if (elm.match(/^[+-]?([0-9]*[.])?[0-9]+$/g)) {
                newSet.base = !isNegative ? parseFloat(elm) : -1 * parseFloat(elm)
                isNegative = false
            }
            if (elm.match(/[xX]{1}\^\d+/g)) {
                newSet.exponent = parseFloat(elm.match(/\d+/g)[0])
                isExponent = true
            }
            if (isExponent) {
                storedSide.push({ base: newSet.base, exponent: newSet.exponent })
                isExponent = false
            }
        });
        return (storedSide)
    },
    mergeSides: (left_side, right_side) => {
        right_side.forEach(elm => {
            elm.base *= -1
            left_side.push(elm)
        })
        return left_side
    },
    reduceEquation: (equation) => {
        let reduced = []
        equation.forEach((elm_1, idx_1) => {
            let newBase = elm_1.base
            equation.forEach((elm_2, idx_2) => {
                if (elm_1.exponent === elm_2.exponent && idx_1 !== idx_2) {
                    newBase = parseFloat(newBase) + parseFloat(elm_2.base)
                    elm_2.base = 0
                }
            });
            elm_1.base = 0
            reduced.push({ base: newBase, exponent: parseFloat(elm_1.exponent) })
        })
        return (reduced.filter((elm) => elm.base !== 0));
    },
    getReduced: (equation) => {
        let reduced = ''
        equation.forEach((elm, i) => {
            if (parseFloat(elm.base) < 0) {
                reduced += i === 0 ? elm.base : elm.base.toString().substring(1)
                reduced += ' * X^' + elm.exponent
            }
            else
                reduced += elm.base + ' * X^' + elm.exponent
            reduced += equation[i + 1] ? parseFloat(equation[i + 1].base) < 0 ? ' - ' : ' + ' : ''
        });
        reduced = "Reduced form: " + reduced + " = 0"
        return reduced
    },
    getBasesAndDegree: (equation) => {
        let degree = 0, a = 0, b = 0, c = 0
        equation.forEach(elm => {
            if (degree < elm.exponent) degree = elm.exponent
            if (elm.exponent === 2) a = elm.base
            if (elm.exponent === 1) b = elm.base
            if (elm.exponent === 0) c = elm.base
        })
        return { degree, a, b, c }
    },
    solveDegree_1: (equation) => {
        let result = 0
        equation.forEach(elm => {
            if (elm.exponent === 0) result += -elm.base
            else result /= elm.base
        })
        console.log('The solution is:\n' + result)
    },
    solveDegree_2: (a, b, c) => {
        console.log('a = \x1b[33m%s\x1b[0m; b = \x1b[33m%s\x1b[0m; c = \x1b[33m%s\x1b[0m', a, b, c);
        let discriminant = (b * b) - (4 * a * c)
        console.log('Discriminant = \x1b[35m(b\u00B2) - (4 * a * c)\x1b[0m =', discriminant)
        if (discriminant < 0) {
            const disc = parseFloat(utilities.sqrt(-discriminant).toFixed(3))
            console.log('Discriminant is strictly negative, the two solutions in C are:')
            console.log('Z1 = (' + -b + ' + ' + disc + '\x1b[33mi\x1b[0m) / ' + (2 * a)) // (-b + sqrt(-discriminant)i / 2a)
            console.log('Z2 = (' + -b + ' - ' + disc + '\x1b[33mi\x1b[0m) / ' + (2 * a)) // (-b - sqrt(-discriminant)i / 2a)
        }
        else if (discriminant === 0) console.log("The solution is = \x1b[35m(-b / (2 * a))\x1b[0m = \x1b[33m" + parseFloat((-b / (2 * a))))
        else if (discriminant > 0) {
            console.log("Discriminant is strictly positive, the two solutions are:")
            console.log('X1 = \x1b[35m(-b - \u221A' + discriminant + ') / (2 * a)\x1b[0m =', parseFloat((-b - utilities.sqrt(discriminant)) / (2 * a)))
            console.log('X2 = \x1b[35m(-b + \u221A' + discriminant + ') / (2 * a)\x1b[0m =', parseFloat((-b + utilities.sqrt(discriminant)) / (2 * a)))
        }
    },
    solver: (equation) => {
        let { degree, a, b, c } = utilities.getBasesAndDegree(equation)
        console.log('Polynomial degree:', degree)
        if (degree > 2) console.log("The polynomial degree is stricly greater than 2, I can't solve.")
        else if (degree <= 0) console.log('There are no solutions.')
        else if (degree === 1) utilities.solveDegree_1(equation)
        else if (degree === 2) utilities.solveDegree_2(a, b, c)
    },
}

module.exports = utilities