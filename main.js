const utilities = require('./utilities')

const main = (argv) => {
    if (!argv) console.log('\x1b[36m%s\x1b[0m', 'Usage: ./computer "THE EQUATION"')
    else if (!utilities.checkSyntax(argv)) console.log('\x1b[31m%s\x1b[0m', 'Error: Syntax Error')
    else {
        let left_side = argv.split("=")[0].trim().split(" ")
        let right_side = argv.split("=")[1].trim().split(" ")
        left_side = utilities.storeSide(left_side)
        right_side = utilities.storeSide(right_side)
        let equation = utilities.mergeSides(left_side, right_side)
        equation = utilities.reduceEquation(equation)
        if (equation.length) {
            equation.sort((a, b) => a.exponent - b.exponent)
            console.log(utilities.getReduced(equation));
            utilities.solver(equation)
        }
        else console.log('Each real number is a solution')
    }
}

main(process.argv[2])